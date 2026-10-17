// Generates every film shot through the Higgsfield CLI (which calls the Higgsfield API),
// stills first, then videos, from films/shots.json. Finished files are skipped on re-runs.
//
//   node scripts/generate-films.mjs --gate 1            # generate the Gate 1 shots
//   node scripts/generate-films.mjs --only F1-03,F1-04  # specific shots
//   node scripts/generate-films.mjs --gate 2 --dry-run  # print the commands only
//   node scripts/generate-films.mjs --cost              # credit estimate for every shot
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'media-src/films');
const FRAMES = path.join(root, 'media-src/frames');

const STILL_DEFAULTS = {
  text2image_soul_v2: ['--aspect_ratio', '16:9', '--quality', '2k'],
  gpt_image_2_5: ['--aspect_ratio', '16:9', '--resolution', '2k'],
};

const resolveInput = (ref, paths) => {
  const [type, name] = ref.split(':');
  if (type === 'frame') return paths.frame(name);
  if (type === 'still') return paths.still(name);
  throw new Error(`Unknown input "${ref}" (use frame:<name> or still:<id>)`);
};

export function shotArgs(shot, paths, { style = '', motion = '' } = {}) {
  if (shot.kind === 'still') {
    const model = shot.model ?? 'text2image_soul_v2';
    const prompt = [shot.text ? '' : style, shot.prompt].filter(Boolean).join(' ');
    return ['generate', 'create', model, '--prompt', prompt, ...(STILL_DEFAULTS[model] ?? ['--aspect_ratio', '16:9']), '--wait', '--json'];
  }
  if (shot.kind === 'audio') return ['generate', 'create', shot.model ?? 'seed_audio', '--prompt', shot.prompt, '--wait', '--json'];
  const args = ['generate', 'create', shot.model ?? 'seedance_2_5', '--prompt', [shot.prompt, motion].filter(Boolean).join(' '),
    '--mode', 'omni_reference', '--duration', String(shot.duration ?? 6), '--resolution', '1080p', '--aspect_ratio', '16:9'];
  if (shot.start) args.push('--start-image', resolveInput(shot.start, paths));
  if (shot.end) args.push('--end-image', resolveInput(shot.end, paths));
  return [...args, '--wait', '--wait-timeout', '30m', '--json'];
}

// The CLI's job JSON shape varies by model; take the first http(s) media URL found.
export function resultUrl(json) {
  let found = null;
  const walk = (v) => {
    if (found || v == null) return;
    if (typeof v === 'string') {
      if (/^https?:\/\/\S+\.(mp4|webm|mov|png|jpe?g|webp|mp3|wav|m4a|ogg)(\?\S*)?$/i.test(v)) found = v;
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(json);
  return found;
}

export const gateShots = (shots, gate) => shots.filter((s) => s.gate === gate);

const EXT = { still: 'png', video: 'mp4', audio: 'mp3' };
const outFile = (shot) => path.join(OUT, `${shot.id}.${EXT[shot.kind]}`);

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function main(argv) {
  const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
  const spec = JSON.parse(fs.readFileSync(path.join(root, 'films/shots.json'), 'utf8'));
  let shots = spec.shots;
  if (opt('--gate')) shots = gateShots(shots, Number(opt('--gate')));
  if (opt('--only')) { const ids = opt('--only').split(','); shots = shots.filter((s) => ids.includes(s.id)); }
  const rank = { still: 0, video: 1, audio: 2 };
  shots = [...shots].sort((a, b) => rank[a.kind] - rank[b.kind]);

  const paths = { frame: (n) => path.join(FRAMES, `${n}.png`), still: (n) => path.join(OUT, `${n}.png`) };
  fs.mkdirSync(OUT, { recursive: true });
  // On Windows call the CLI's own executable: going through cmd.exe would mangle quotes in prompts.
  const winExe = path.join(process.env.APPDATA ?? '', 'npm/node_modules/@higgsfield/cli/vendor/hf.exe');
  const bin = process.platform === 'win32' && fs.existsSync(winExe) ? winExe : 'higgsfield';

  for (const shot of shots) {
    const args = shotArgs(shot, paths, spec);
    if (argv.includes('--cost')) {
      const costArgs = ['generate', 'cost', ...args.slice(2).filter((a, i, all) => !['--wait', '--json'].includes(a) && all[i - 1] !== '--wait-timeout' && a !== '--wait-timeout')];
      const r = spawnSync(bin, costArgs, { encoding: 'utf8' });
      console.log(`${shot.id.padEnd(14)} ${(r.stdout || r.stderr).trim().split('\n').pop()}`);
      continue;
    }
    const file = outFile(shot);
    if (fs.existsSync(file)) { console.log(`✓ ${shot.id} (already generated)`); continue; }
    if (argv.includes('--dry-run')) { console.log(`higgsfield ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`); continue; }
    console.log(`… ${shot.id}`);
    const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) { console.error(`✖ ${shot.id}: ${(r.stderr || r.stdout).trim()}`); return 1; }
    const url = resultUrl(JSON.parse(r.stdout));
    if (!url) { console.error(`✖ ${shot.id}: no media URL in response`); return 1; }
    await download(url, file);
    console.log(`✓ ${shot.id} → ${path.relative(root, file)}`);
  }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(await main(process.argv.slice(2)));
