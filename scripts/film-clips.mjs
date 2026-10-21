// Code-made hero scenes: each stop's approved K4 keyframe becomes an 8 s clip with a slow, eased
// push-in (no AI). Output: media-src/film/<stop>.mp4 (1080×1080), then `npm run media` makes the web files.
// Run: node scripts/film-clips.mjs [stop ...]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const SECONDS = 8;

// Per stop: approved K4, horizontal centre of the square crop (0–1) and how far the camera pushes in.
const STOPS = {
  barbearia: { k4: 'films/keyframes/F1/K4.jpg', cx: 0.5, zoom: 0.14 },
  clinica: { k4: 'films/keyframes/F1-clinica/K4.jpg', cx: 0.56, zoom: 0.12 },
  advocacia: { k4: 'films/keyframes/F1-advocacia/K4.jpg', cx: 0.5, zoom: 0.12 },
  roda: { k4: 'films/keyframes/F1-roda/K4.jpg', cx: 0.5, zoom: 0.16 },
};

export function clipFilter({ cx, zoom }, { fps = FPS, seconds = SECONDS, size = 1080 } = {}) {
  const n = fps * seconds;
  // Square crop around cx, upscaled 4× so the sub-pixel zoom steps don't judder.
  const crop = `crop=ih:ih:'min(max(iw*${cx}-ih/2,0),iw-ih)':0,scale=${size * 4}:${size * 4}:flags=lanczos`;
  const ease = `(1-cos(PI*on/${n - 1}))/2`; // ease-in-out over the whole clip
  const zp = `zoompan=z='1+${zoom}*${ease}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${n}:s=${size}x${size}:fps=${fps}`;
  return `${crop},${zp},format=yuv420p`;
}

function main(ids) {
  const out = path.join(root, 'media-src/film');
  fs.mkdirSync(out, { recursive: true });
  for (const id of ids.length ? ids : Object.keys(STOPS)) {
    const stop = STOPS[id];
    if (!stop) { console.error(`✖ unknown stop "${id}"`); return 1; }
    const file = path.join(out, `${id}.mp4`);
    const args = ['-v', 'error', '-y', '-loop', '1', '-i', path.join(root, stop.k4), '-vf', clipFilter(stop),
      '-frames:v', String(FPS * SECONDS), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-an', file];
    const r = spawnSync(ffmpeg, args, { encoding: 'utf8' });
    if (r.status !== 0) { console.error(`✖ ${id}: ${r.stderr.trim()}`); return 1; }
    console.log(`✓ ${path.relative(root, file)}`);
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
