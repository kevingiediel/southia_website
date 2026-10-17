// Renders exact brand frames (1920×1080) from the official SVGs in src/assets/brand/.
// These are the start/end images for every logo shot, so the AI never redraws the logo.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const W = 1920;
const H = 1080;
const BG = '#1C3322';
const brand = (f) => fs.readFileSync(path.join('src/assets/brand', f), 'utf8');
const out = 'media-src/frames';
fs.mkdirSync(out, { recursive: true });

const page = await (await chromium.launch()).newPage({ viewport: { width: W, height: H } });
const frame = async (name, body, css = '') => {
  await page.setContent(`<style>html,body{margin:0;width:${W}px;height:${H}px;background:${BG};overflow:hidden}
    @font-face{font-family:Figtree;font-weight:400 700;src:url(data:font/woff2;base64,${fs.readFileSync('public/fonts/figtree-latin.woff2').toString('base64')}) format('woff2')}
    .stage{position:absolute;inset:0;display:grid;place-items:center} svg{display:block}
    ${css}</style><div class="stage">${body}</div>`);
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  console.log(`${name}.png`);
};

// Find the symbol's 8 places and the spark in rendered coordinates (fraction of the symbol box).
await page.setContent(`<div id="s" style="width:1000px;height:1000px">${brand('simbolo-negativa.svg')}</div>`);
const geo = await page.evaluate(() => {
  const svg = document.querySelector('#s svg');
  svg.setAttribute('width', 1000); svg.setAttribute('height', 1000);
  const box = svg.getBoundingClientRect();
  const shapes = [...svg.querySelectorAll('path')].map((p) => ({ r: p.getBoundingClientRect(), fill: p.getAttribute('fill') }));
  const big = Math.max(...shapes.map((s) => s.r.width));
  const centre = (r) => ({ x: (r.left + r.width / 2 - box.left) / box.width, y: (r.top + r.height / 2 - box.top) / box.height, d: r.width / box.width });
  const people = shapes.filter((s) => s.r.width > big * 0.12 && s.r.width < big * 0.3 && s.fill !== 'none').map((s) => centre(s.r));
  const spark = shapes.find((s) => (s.fill || '').toUpperCase() === '#F2C230');
  return { people, spark: centre(spark.r) };
});
const dedupe = geo.people.filter((p, i, a) => a.findIndex((q) => Math.hypot(q.x - p.x, q.y - p.y) < 0.02) === i);
const at = (angleDeg) => dedupe.reduce((best, p) => {
  const a = (Math.atan2(p.x - 0.5, 0.5 - p.y) * 180 / Math.PI + 360) % 360;
  const diff = Math.min(Math.abs(a - angleDeg), 360 - Math.abs(a - angleDeg));
  return !best || diff < best.diff ? { ...p, diff } : best;
}, null);

const symbol = brand('simbolo-negativa.svg');
const SIZE = 460; // symbol height in the full frame
await frame('logo-full', symbol, `svg{height:${SIZE}px;width:auto}`);

// Zoomed frames: scale the exact symbol so one place fills ~55% of the frame height, centred.
const zoom = async (name, target) => {
  const scale = (H * 0.3) / (target.d * SIZE); // gentle: the source circles are polylines, deep zoom shows facets
  const tx = (0.5 - target.x) * SIZE * scale;
  const ty = (0.5 - target.y) * SIZE * scale;
  await frame(name, symbol, `svg{height:${SIZE}px;width:auto;transform:translate(${tx}px,${ty}px) scale(${scale})}`);
};
await zoom('logo-zoom-barbearia', at(0));
await zoom('logo-zoom-clinica', at(90));
await zoom('logo-zoom-advocacia', at(225));
await zoom('logo-zoom-centelha', { ...geo.spark, d: geo.spark.d * 1.6 });

const horizontal = brand('horizontal-negativa.svg');
await frame('logo-horizontal', horizontal, 'svg{width:900px;height:auto}');
await frame('logo-horizontal-cta', `<div style="display:grid;gap:64px;justify-items:center">${horizontal}
  <span style="font:600 34px Figtree,system-ui,sans-serif;color:#1C3322;background:#F2C230;padding:24px 48px;border-radius:999px">Agendar uma conversa</span></div>`,
  'svg{width:900px;height:auto}');
process.exit(0);
