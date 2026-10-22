// Turns raw clips in media-src/<slot-id>.(mp4|mov|webm) into web-ready
// public/media/<slot-id>.{mp4,webm,jpg}, cropped to each slot's size.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const SIZES = { circle: [360, 360], pill: [460, 640], rounded: [460, 640], rect: [800, 500], como: [800, 1000] };
export const BUDGET = { circle: 300_000, default: 800_000 };

export function slotSpec(id, site) {
  if (id.startsWith('film/')) {
    const stop = (site.film?.stops ?? []).find((s) => `film/${s.id}` === id);
    if (!stop) throw new Error(`Unknown slot: ${id}`);
    // The spark stop is a tall diamond (10% × 17% of the ring), the others are circles.
    if (stop.circle === 'spark') return { id, shape: 'spark', width: 424, height: 720, budget: 1_200_000 };
    return { id, shape: 'circle', width: 720, height: 720, budget: 1_200_000 };
  }
  let shape;
  if (site.hero.avatars.some((a) => a.id === id)) shape = 'circle';
  else if (site.marquee.some((m) => m.id === id)) shape = site.marquee.find((m) => m.id === id).shape;
  else if (site.solutions.some((s) => s.media.id === id)) shape = 'rect';
  else if (site.como.media.id === id) shape = 'como';
  else throw new Error(`Unknown slot: ${id}`);
  const [width, height] = SIZES[shape];
  return { id, shape: shape === 'como' ? 'rounded' : shape, width, height, budget: BUDGET[shape] ?? BUDGET.default };
}

export function ffmpegArgs(input, spec, format) {
  const vf = `scale=${spec.width}:${spec.height}:force_original_aspect_ratio=increase,crop=${spec.width}:${spec.height}`;
  const head = ['-v', 'error', '-y', '-i', input, '-vf', vf];
  if (format === 'mp4') return [...head, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart'];
  if (format === 'webm') return [...head, '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-an'];
  if (format === 'jpg') return [...head, '-frames:v', '1', '-q:v', '3'];
  throw new Error(`Unknown format: ${format}`);
}

function main() {
  const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
  const srcDir = path.join(root, 'media-src');
  const outDir = path.join(root, 'public/media');
  fs.mkdirSync(outDir, { recursive: true });
  const list = (dir, prefix) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(mp4|mov|webm)$/i.test(f)).map((f) => prefix + f) : []);
  const raws = [...list(srcDir, ''), ...list(path.join(srcDir, 'film'), 'film/')];
  fs.mkdirSync(path.join(outDir, 'film'), { recursive: true });
  if (!raws.length) {
    console.log('No raw clips in media-src/. Name them <slot-id>.mp4 (see docs/MEDIA.md).');
    return 0;
  }

  let failures = 0;
  const rows = [];
  for (const file of raws) {
    const id = file.slice(0, -path.extname(file).length); // keeps a "film/" prefix
    let spec;
    try { spec = slotSpec(id, site); } catch (err) { console.error(`✖ ${file}: ${err.message}`); failures++; continue; }
    for (const format of ['mp4', 'webm', 'jpg']) {
      const out = path.join(outDir, `${id}.${format}`);
      const res = spawnSync(ffmpeg, [...ffmpegArgs(path.join(srcDir, file), spec, format), out], { encoding: 'utf8' });
      if (res.status !== 0) { console.error(`✖ ${id}.${format}: ${res.stderr.trim()}`); failures++; continue; }
      const size = fs.statSync(out).size;
      const over = format !== 'jpg' && size > spec.budget;
      rows.push(`${`${id}.${format}`.padEnd(18)} ${String(Math.round(size / 1024)).padStart(5)} KB${over ? `  ⚠ over budget (${spec.budget / 1000} KB)` : ''}`);
    }
  }
  console.log(rows.join('\n'));
  return failures ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main());
