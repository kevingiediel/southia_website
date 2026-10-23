// One 4-page A4 brochure per product, from docs/produtos/conteudo.json, rendered by Chromium.
// Brand fonts and the official logo are embedded; photos are recompressed for a light PDF.
// Run: node scripts/product-pdfs.mjs [atende|juridico|criativos ...]  → exports/pdf/<Name>.pdf
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'docs/produtos/conteudo.json'), 'utf8'));
const OUT = path.join(root, 'exports/pdf');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'southia-pdf-'));

const b64 = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
const font = (file, weight, family) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(${b64(path.join(root, 'public/fonts', file), 'font/woff2')}) format('woff2')}`;
const svg = (name) => fs.readFileSync(path.join(root, 'src/assets/brand', name), 'utf8');
// Print-sized JPEG (≈ 150 dpi across an A4 width) so each PDF stays a few MB.
const photo = (src, width = 1500) => {
  const out = path.join(tmp, `${src.replace(/[\/.:]/g, '_')}-${width}.jpg`); // every stop's keyframe is named K4.jpg
  if (!fs.existsSync(out)) {
    const r = spawnSync(ffmpeg, ['-v', 'error', '-y', '-i', path.join(root, src), '-vf', `scale=${width}:-2,setsar=1`, '-q:v', '4', out]);
    if (r.status !== 0) throw new Error(`ffmpeg: ${src}`);
  }
  return b64(out, 'image/jpeg');
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const CSS = `
${font('figtree-latin.woff2', '400 700', 'Figtree')}
${['500', '600', '700'].map((w) => font(`montserrat-alt-${w}-latin.woff2`, w, 'Montserrat Alternates')).join('\n')}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: Figtree, sans-serif; color: #1C3322; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; background: #FBF8F1; }
.page:last-child { page-break-after: auto; }
h1, h2, h3 { font-family: 'Montserrat Alternates', sans-serif; margin: 0; letter-spacing: -.02em; }
p { margin: 0; }
.hl { color: #F2C230; font-style: normal; }
.eyebrow { font-size: 9pt; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: #3E6A3B; }

/* Cover */
.cover { background: #1C3322; color: #F3EEE2; }
.cover__photo { position: absolute; left: 0; right: 0; top: 0; height: 150mm; background-size: cover; background-position: center; }
.cover__photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(28,51,34,.75) 0%, rgba(28,51,34,0) 22%, rgba(28,51,34,0) 45%, #1C3322 100%); }
.cover__logo { position: absolute; top: 14mm; left: 16mm; width: 46mm; }
.cover__logo svg { width: 100%; height: auto; display: block; }
.cover__body { position: absolute; left: 16mm; right: 16mm; top: 150mm; display: flex; flex-direction: column; gap: 6mm; }
.cover .eyebrow { color: #A3C08A; }
.cover h1 { font-size: 44pt; font-weight: 700; line-height: 1.02; color: #F3EEE2; }
.cover__headline { font-family: 'Montserrat Alternates', sans-serif; font-weight: 500; font-size: 19pt; line-height: 1.25; color: #F2C230; max-width: 160mm; }
.cover__intro { font-size: 11.5pt; line-height: 1.6; color: #D9E2CC; max-width: 165mm; }
.cover__foot { position: absolute; left: 16mm; right: 16mm; bottom: 12mm; display: flex; justify-content: space-between; font-size: 9pt; color: #A3C08A; border-top: 1px solid rgba(163,192,138,.3); padding-top: 4mm; }

/* Inner pages */
.inner { padding: 16mm 16mm 22mm; display: flex; flex-direction: column; gap: 8mm; }
.bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 4mm; border-bottom: 1px solid #E2DBCB; }
.bar__logo { width: 30mm; } .bar__logo svg { width: 100%; height: auto; display: block; }
.bar__name { font-size: 9pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #3E6A3B; }
.foot { position: absolute; left: 16mm; right: 16mm; bottom: 10mm; display: flex; justify-content: space-between; font-size: 8.5pt; color: #6B7A6D; }
.h2 { font-size: 24pt; font-weight: 600; line-height: 1.12; }
.lead { font-size: 11.5pt; line-height: 1.6; color: #3A4A3C; }

.two { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.box { background: #F3EEE2; border-radius: 5mm; padding: 7mm; display: flex; flex-direction: column; gap: 4mm; }
.box--dark { background: #1C3322; color: #F3EEE2; }
.box--dark .lead { color: #D9E2CC; }
.box--dark .eyebrow { color: #A3C08A; }
.pains { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3.5mm; }
.pains li { position: relative; padding-left: 7mm; font-size: 10.5pt; line-height: 1.5; color: #3A4A3C; }
.pains li::before { content: ''; position: absolute; left: 0; top: 1.6mm; width: 3mm; height: 3mm; border-radius: 50%; background: #F2C230; }
.figure { height: 78mm; border-radius: 5mm; background-size: cover; background-position: center; }

.chat { background: #F7F5EE; border-radius: 5mm; overflow: hidden; border: 1px solid #E2DBCB; }
.chat__head { background: #1C3322; color: #F3EEE2; padding: 3.5mm 5mm; font-weight: 700; font-size: 10pt; display: flex; align-items: center; gap: 3mm; }
.chat__head small { display: block; font-weight: 500; font-size: 8pt; color: #A3C08A; }
.chat__dot { width: 7mm; height: 7mm; border-radius: 50%; background: #A3C08A; flex: none; }
.chat__body { padding: 4mm 5mm 5mm; display: flex; flex-direction: column; gap: 2.5mm; }
.msg { max-width: 82%; padding: 2.5mm 3.5mm; border-radius: 3.5mm; font-size: 9.5pt; line-height: 1.4; }
.msg--cliente { align-self: flex-start; background: #fff; border: 1px solid #ECE6D8; }
.msg--agente { align-self: flex-end; background: #DCF3C8; }

.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
.step { display: flex; flex-direction: column; gap: 2.5mm; }
.step__n { width: 9mm; height: 9mm; border-radius: 50%; background: #F2C230; color: #1C3322; display: grid; place-items: center; font-weight: 700; font-size: 10pt; }
.step h3 { font-size: 11.5pt; font-weight: 600; line-height: 1.2; }
.step p { font-size: 9.5pt; line-height: 1.5; color: #3A4A3C; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.feat { background: #F3EEE2; border-radius: 4mm; padding: 5mm; display: flex; flex-direction: column; gap: 2mm; border-top: 1.2mm solid #A3C08A; }
.feat h3 { font-size: 11pt; font-weight: 600; }
.feat p { font-size: 9.5pt; line-height: 1.45; color: #3A4A3C; }
.aud { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.aud--4 { grid-template-columns: repeat(2, 1fr); }
.aud .feat { border-top-color: #F2C230; }
.band { flex: 1; min-height: 60mm; border-radius: 5mm; background-size: cover; background-position: center; }
.inner--fill > .cta { margin-top: auto; }

.why { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.why .box { padding: 6mm; }
.why h3 { font-size: 11pt; font-weight: 600; color: #F3EEE2; }
.why p { font-size: 9.5pt; line-height: 1.5; color: #D9E2CC; }
.cta { background: #F2C230; border-radius: 6mm; padding: 9mm; display: flex; flex-direction: column; gap: 3mm; }
.cta h2 { font-size: 20pt; font-weight: 700; color: #1C3322; }
.cta p { font-size: 11pt; line-height: 1.5; color: #1C3322; }
.close { font-family: 'Montserrat Alternates', sans-serif; font-weight: 600; font-size: 15pt; text-align: center; color: #1C3322; }
.close .hl { color: #3E6A3B; }
`;

const bar = (p) => `<div class="bar"><div class="bar__logo">${svg('horizontal-positiva.svg')}</div><span class="bar__name">${esc(p.name)}</span></div>`;
const foot = (n) => `<div class="foot"><span>Pessoas, dados e IA na mesma roda.</span><span>southia.com.br · ${n}/4</span></div>`;

function pages(p) {
  const chat = `<div class="chat"><div class="chat__head"><span class="chat__dot"></span><span>${esc(p.chatTitle)}<small>Agente Southia · ${p.chat.some((m) => m.from === 'cliente') ? 'WhatsApp' : 'relatório automático'}</small></span></div>
    <div class="chat__body">${p.chat.map((m) => `<p class="msg msg--${m.from}">${esc(m.text)}</p>`).join('')}</div></div>`;
  const cover = `<section class="page cover">
    <div class="cover__photo" style="background-image:url(${photo(p.cover, 1800)})"></div>
    <div class="cover__logo">${svg('horizontal-negativa.svg')}</div>
    <div class="cover__body">
      <p class="eyebrow">${esc(p.kicker)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="cover__headline">${esc(p.headline)}</p>
      <p class="cover__intro">${esc(p.intro)}</p>
    </div>
    <div class="cover__foot"><span>Southia · Pessoas, dados e IA na mesma roda.</span><span>southia.com.br</span></div>
  </section>`;
  const problem = `<section class="page inner">${bar(p)}
    <div class="two">
      <div class="box"><p class="eyebrow">${esc(p.challengeTitle)}</p><h2 class="h2">O que trava o dia a dia</h2>
        <ul class="pains">${p.challenge.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div class="figure" style="background-image:url(${photo(p.side, 1100)})"></div>
    </div>
    <div class="two">
      <div class="box box--dark"><p class="eyebrow">${esc(p.solutionTitle)}</p><h2 class="h2" style="color:#F3EEE2">Como o <em class="hl">${esc(p.name)}</em> resolve</h2>
        <p class="lead">${esc(p.solution)}</p></div>
      <div style="display:flex;flex-direction:column;gap:3mm;justify-content:center"><p class="eyebrow">Na prática</p>${chat}</div>
    </div>
    ${foot(2)}</section>`;
  const how = `<section class="page inner">${bar(p)}
    <div><p class="eyebrow">Como funciona</p><h2 class="h2">Do primeiro papo ao agente no ar</h2></div>
    <div class="steps">${p.steps.map((s, i) => `<div class="step"><span class="step__n">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
    <div><p class="eyebrow">Recursos</p><h2 class="h2">O que o ${esc(p.name)} faz por você</h2></div>
    <div class="grid">${p.features.map((f) => `<div class="feat"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`).join('')}</div>
    <div class="band" style="background-image:url(${photo(p.band, 1600)})"></div>
    ${foot(3)}</section>`;
  const who = `<section class="page inner inner--fill">${bar(p)}
    <div><p class="eyebrow">${p.audience.length === 6 ? 'Nichos' : 'Público'}</p><h2 class="h2">${esc(p.audienceTitle)}</h2></div>
    <div class="aud${p.audience.length === 4 ? ' aud--4' : ''}">${p.audience.map((a) => `<div class="feat"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>`).join('')}</div>
    <div><p class="eyebrow">Por que a Southia</p><h2 class="h2">Tecnologia com gente dentro</h2></div>
    <div class="why">
      <div class="box box--dark"><h3>Feito para o seu negócio</h3><p>Configuramos o agente com as suas regras, o seu vocabulário e o seu jeito de falar.</p></div>
      <div class="box box--dark"><h3>Gente de verdade junto</h3><p>Você não fica sozinho com a ferramenta: acompanhamos, ajustamos e seguimos junto.</p></div>
      <div class="box box--dark"><h3>Segurança e LGPD</h3><p>Dados tratados com responsabilidade, segurança e respeito à LGPD.</p></div>
    </div>
    <div class="cta"><p class="eyebrow" style="color:#1C3322">Próximos passos</p><h2>Vamos colocar o ${esc(p.name)} para girar no seu negócio?</h2>
      <p>Fale com a gente para uma proposta: entendemos a sua rotina e mostramos o agente funcionando com o seu caso.</p></div>
    <p class="close">Pessoas, dados e IA na mesma <em class="hl">roda</em>.</p>
    ${foot(4)}</section>`;
  return cover + problem + how + who;
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(content);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const id of ids) {
  const p = content[id];
  if (!p) { console.error(`✖ unknown product "${id}"`); process.exitCode = 1; continue; }
  await page.setContent(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(p.name)}</title><style>${CSS}</style></head><body>${pages(p)}</body></html>`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, p.file);
  await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log(`✓ ${path.relative(root, file)} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
