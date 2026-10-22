// Code-made hero scenes: each stop's approved K4 keyframe becomes an 11 s clip with a slow, eased
// camera move (no AI). Output: media-src/film/<stop>.mp4 (1080 tall), then `npm run media` makes the web files.
// Run: node scripts/film-clips.mjs [stop ...]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
// Long enough to cover the whole visit (zoom in 1.1 + dwell 6.6 + back to the circle 1.3 + fade 1.1 s): the clip never runs out on screen.
const SECONDS = 11;

// Per stop: source still, horizontal centre of the crop (0–1), the frame's width/height and the camera move
// (zoom > 0 pushes in, zoom < 0 starts close and pulls out).
// The roda is shown through the spark (a 0.59:1 diamond), so it uses a tall view and `widen`: the sharp photo
// shrinks from `from` to `to` of the frame over a blurred continuation of the same grass, so the camera
// opens further than the photo itself and nobody around the fire is ever cut.
const STOPS = {
  barbearia: { k4: 'films/keyframes/F1/K4.jpg', cx: 0.5, zoom: 0.08 },
  clinica: { k4: 'films/keyframes/F1-clinica/K4.jpg', cx: 0.56, zoom: 0.07 },
  advocacia: { k4: 'films/keyframes/F1-advocacia/K4.jpg', cx: 0.5, zoom: 0.07 },
  roda: { k4: 'media-src/films/F1-RODA-tall.png', cx: 0.5, aspect: 0.59, widen: { from: 0.9, to: 0.64 } },
};

export const frameSize = (aspect = 1, height = 1080) => [Math.round((height * aspect) / 2) * 2, height];

export function clipFilter({ cx, zoom, aspect = 1 }, { fps = FPS, seconds = SECONDS, height = 1080 } = {}) {
  const n = fps * seconds;
  const [w, h] = frameSize(aspect, height);
  // Crop to the frame's shape around cx, upscaled 4× so the sub-pixel zoom steps don't judder.
  const crop = `crop='min(iw,ih*${aspect})':'min(ih,iw/${aspect})':'min(max(iw*${cx}-ow/2,0),iw-ow)':'(ih-oh)/2',scale=${w * 4}:${h * 4}:flags=lanczos`;
  const ease = `(1-cos(PI*on/${n - 1}))/2`; // ease-in-out over the whole clip
  const z = zoom >= 0 ? `1+${zoom}*${ease}` : `1+${-zoom}*(1-${ease})`;
  const zp = `zoompan=z='${z}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${n}:s=${w}x${h}:fps=${fps}`;
  return `${crop},${zp},format=yuv420p`;
}

// Two passes: the still layers once (the mask is costly), then the per-frame shrink over the looped stills.
function widenClip(stop, file, { fps = FPS, seconds = SECONDS, height = 1080 } = {}) {
  const [w, h] = frameSize(stop.aspect, height);
  const [W, H] = [w * 2, h * 2]; // work at 2× so the shrinking size steps stay sub-pixel in the output
  const tmp = fs.mkdtempSync(path.join(root, 'media-src/.widen-'));
  const crop = `crop='min(iw,ih*${stop.aspect})':'min(ih,iw/${stop.aspect})':'(iw-ow)/2':'(ih-oh)/2'`;
  const run = (args) => { const r = spawnSync(ffmpeg, ['-v', 'error', '-y', ...args], { encoding: 'utf8' }); if (r.status !== 0) throw new Error(r.stderr.trim()); };
  try {
    const src = path.join(root, stop.k4);
    const bg = path.join(tmp, 'bg.png');
    const fg = path.join(tmp, 'fg.png');
    // Background: only grass (the bottom band of the photo, no people), stretched and blurred.
    run(['-i', src, '-vf', `crop=iw:ih*0.2:0:ih*0.78,scale=${W}:${H},gblur=sigma=70,eq=brightness=0.02:saturation=0.95,setsar=1`, '-frames:v', '1', bg]);
    // The photo stays fully sharp over the whole diamond the spark shows (|dx| + |dy| <= 1) and only
    // fades past it, into the grass, once it has shrunk enough for that edge to come into view.
    run(['-i', src, '-vf', `${crop},scale=${W}:${H},format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip((1.2-abs(X-W/2)/(W/2)-abs(Y-H/2)/(H/2))/0.26,0,1)'`, '-frames:v', '1', fg]);
    const { from, to } = stop.widen;
    const sc = `(${from}+(${to}-${from})*(1-cos(PI*t/${seconds}))/2)`;
    const graph = `[1:v]scale=w='trunc(${W}*${sc}/2)*2':h='trunc(${H}*${sc}/2)*2':eval=frame[f];`
      + `[0:v][f]overlay=x='(W-w)/2':y='(H-h)/2',scale=${w}:${h}:flags=lanczos,setsar=1,fps=${fps},format=yuv420p`;
    run(['-loop', '1', '-framerate', String(fps), '-i', bg, '-loop', '1', '-framerate', String(fps), '-i', fg, '-filter_complex', graph,
      '-frames:v', String(fps * seconds), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-an', file]);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function main(ids) {
  const out = path.join(root, 'media-src/film');
  fs.mkdirSync(out, { recursive: true });
  for (const id of ids.length ? ids : Object.keys(STOPS)) {
    const stop = STOPS[id];
    if (!stop) { console.error(`✖ unknown stop "${id}"`); return 1; }
    const file = path.join(out, `${id}.mp4`);
    if (stop.widen) {
      try { widenClip(stop, file); } catch (err) { console.error(`✖ ${id}: ${err.message}`); return 1; }
      console.log(`✓ ${path.relative(root, file)}`);
      continue;
    }
    const args = ['-v', 'error', '-y', '-loop', '1', '-i', path.join(root, stop.k4), '-vf', clipFilter(stop),
      '-frames:v', String(FPS * SECONDS), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-an', file];
    const r = spawnSync(ffmpeg, args, { encoding: 'utf8' });
    if (r.status !== 0) { console.error(`✖ ${id}: ${r.stderr.trim()}`); return 1; }
    console.log(`✓ ${path.relative(root, file)}`);
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
