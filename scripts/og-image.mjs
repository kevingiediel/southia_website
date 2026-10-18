// Renders public/og-image.jpg (1200×630 social share card) from the official brand files.
// Run: npm run og-image
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const font = (f) => `url(data:font/woff2;base64,${fs.readFileSync(`public/fonts/${f}`).toString('base64')}) format('woff2')`;
const symbol = fs.readFileSync('src/assets/brand/simbolo-negativa.svg', 'utf8');
const logo = fs.readFileSync('src/assets/brand/horizontal-negativa.svg', 'utf8');

const html = `<style>
  @font-face { font-family: Figtree; font-weight: 400 700; src: ${font('figtree-latin.woff2')}; }
  @font-face { font-family: 'Montserrat Alternates'; font-weight: 500; src: ${font('montserrat-alt-500-latin.woff2')}; }
  html, body { margin: 0; width: 1200px; height: 630px; background: #1C3322; overflow: hidden; }
  .card { position: relative; width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 360px; align-items: center; gap: 40px; padding: 0 80px; box-sizing: border-box; }
  .logo svg { width: 230px; height: auto; display: block; }
  h1 { margin: 44px 0 26px; font: 500 64px/1.04 'Montserrat Alternates', sans-serif; letter-spacing: -.03em; color: #F3EEE2; }
  h1 em { font-style: normal; color: #F2C230; }
  p { margin: 0; font: 600 18px Figtree, sans-serif; letter-spacing: .28em; text-transform: uppercase; color: #A3C08A; }
  .symbol svg { width: 360px; height: 360px; display: block; }
</style>
<div class="card">
  <div><div class="logo">${logo}</div><h1>Pessoas, dados e IA na mesma <em>roda</em>.</h1><p>southia.com.br</p></div>
  <div class="symbol">${symbol}</div>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 88 });
await browser.close();
console.log('public/og-image.jpg', fs.statSync('public/og-image.jpg').size, 'bytes');
