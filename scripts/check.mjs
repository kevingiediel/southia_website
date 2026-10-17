// Post-build checks for dist/. Errors fail the build; warnings are printed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import zlib from 'node:zlib';

export const JS_BUDGET = 61_440; // bytes, gzipped

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function slotIds(site) {
  return [
    ...site.hero.avatars.map((a) => a.id),
    ...site.marquee.map((m) => m.id),
    ...site.solutions.map((s) => s.media.id),
    site.como.media.id,
  ];
}

const read = (f) => fs.readFileSync(f, 'utf8');
const exists = (dist, p) => fs.existsSync(path.join(dist, decodeURIComponent(p.split(/[?#]/)[0])));

export function runChecks(distDir = path.join(root, 'dist')) {
  const errors = [];
  const warnings = [];
  const indexFile = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexFile)) return { errors: ['dist/index.html missing'], warnings };

  const site = JSON.parse(read(path.join(root, 'src/data/site.json')));
  const known = new Set([...slotIds(site), ...(site.film?.stops ?? []).map((s) => `film/${s.id}`)]);
  const missingMedia = new Set();
  const htmlFiles = fs.readdirSync(distDir).filter((f) => f.endsWith('.html'));

  for (const file of htmlFiles) {
    const html = read(path.join(distDir, file));
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, hash] of html.matchAll(/href="#([^"]*)"/g)) {
      if (hash && !ids.has(hash)) errors.push(`${file}: anchor #${hash} has no matching id`);
    }
    for (const [, attr, ref] of html.matchAll(/\s(src|href|poster|data-src|data-poster)="(\/[^"/][^"]*)"/g)) {
      const mediaId = ref.match(/^\/media\/((?:film\/)?[^/.]+)\.\w+$/)?.[1];
      if (mediaId && !known.has(mediaId)) errors.push(`${file}: ${attr}="${ref}" references unknown slot "${mediaId}"`);
      if (exists(distDir, ref)) continue;
      if (mediaId && ['poster', 'data-src', 'data-poster'].includes(attr)) missingMedia.add(mediaId);
      else errors.push(`${file}: ${attr}="${ref}" not found in dist`);
    }
  }

  const assets = path.join(distDir, 'assets');
  if (fs.existsSync(assets)) {
    for (const f of fs.readdirSync(assets).filter((n) => n.endsWith('.css'))) {
      for (const [, ref] of read(path.join(assets, f)).matchAll(/url\(\s*['"]?(\/[^'")]+)['"]?\s*\)/g)) {
        if (!exists(distDir, ref)) errors.push(`assets/${f}: url(${ref}) not found in dist`);
      }
    }
  }

  if (missingMedia.size) warnings.push(`media files missing for ${missingMedia.size} slot(s): ${[...missingMedia].join(', ')}`);

  const index = read(indexFile);
  for (const id of slotIds(site)) {
    if (!index.includes(`data-media="${id}"`)) errors.push(`media slot "${id}" missing from index.html`);
  }

  if (index.includes('wa.me/TODO')) errors.push('index.html links to a placeholder WhatsApp number');
  if (!index.includes('<link rel="canonical" href="https://southia.com.br/">')) errors.push('canonical link missing');
  if (!/property="og:image" content="https:\/\/southia\.com\.br\/og-image\.jpg"/.test(index)) errors.push('og:image missing');
  for (const f of ['.htaccess', 'robots.txt', 'sitemap.xml', '404.html']) {
    if (!fs.existsSync(path.join(distDir, f))) errors.push(`dist/${f} missing`);
  }
  if (fs.existsSync(assets)) {
    const js = fs.readdirSync(assets).filter((n) => n.endsWith('.js'));
    const gz = js.reduce((sum, n) => sum + zlib.gzipSync(fs.readFileSync(path.join(assets, n))).length, 0);
    if (gz > JS_BUDGET) errors.push(`JS bundle ${gz} B gzipped exceeds ${JS_BUDGET} B`);
  }

  return { errors, warnings };
}

function validateHtml(distDir) {
  const bin = path.join(root, 'node_modules/html-validate/bin/html-validate.mjs');
  const files = fs.readdirSync(distDir).filter((f) => f.endsWith('.html')).map((f) => path.join(distDir, f));
  try {
    execFileSync(process.execPath, [bin, ...files], { cwd: root, stdio: 'pipe' });
    return [];
  } catch (err) {
    return [`html-validate failed:\n${err.stdout?.toString() || err.message}`];
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = path.join(root, 'dist');
  const { errors, warnings } = runChecks(dist);
  if (!errors.length) errors.push(...validateHtml(dist));
  for (const w of warnings) console.warn(`⚠ ${w}`);
  for (const e of errors) console.error(`✖ ${e}`);
  console.log(`check: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}
