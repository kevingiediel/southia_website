// Composites the code-built keyframes of a Film 1 stop at 1920×1080:
//   K3 — camera inside the stop's circle of the official symbol, which opens like a window onto K4
//   K5 — K4 with the message bubbles (first 2)
//   K6 — K4 with all 4 bubbles
// The logo comes from the official SVG and the bubble text is typed, so neither is ever redrawn by AI.
// Run: node scripts/keyframes-f1.mjs [barbearia|advocacia]
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const W = 1920;
const H = 1080;

// Per stop: where its frames live, which circle of the symbol it enters (clock angle), and the bubbles.
const SEGMENTS = {
  barbearia: {
    out: 'films/keyframes/F1',
    angle: 0, // 12 o'clock
    title: 'Barbearia do Samuel',
    messages: [
      { time: 'Hoje 10:24', text: 'Oi, tem horário amanhã às 15h para barba?', from: 'cliente', side: 'in' },
      { time: 'Hoje 10:25', text: 'Tem sim! 15h com o Samuel. Confirmo pra você?', from: 'Barbearia do Samuel', side: 'out' },
      { time: 'Hoje 10:26', text: 'Pode confirmar', from: 'cliente', side: 'in' },
      { time: 'Hoje 10:27', text: 'Prontinho, te lembro amanhã.', from: 'Barbearia do Samuel', side: 'out' },
    ],
  },
  clinica: {
    out: 'films/keyframes/F1-clinica',
    angle: 90, // right circle (hero stop "clinica")
    title: 'Clínica Movimento',
    messages: [
      { time: 'Hoje 08:00', text: 'Post de hoje publicado no Instagram: alongamento matinal', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 08:01', text: 'Legenda e imagem criadas a partir da sua marca', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 08:01', text: 'Próximos posts agendados: Seg 9h, Qua 18h, Sex 12h', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 08:02', text: '27 novos seguidores e 3 agendamentos pelo direct', from: 'Agente Southia', side: 'out' },
    ],
  },
  advocacia: {
    out: 'films/keyframes/F1-advocacia',
    angle: 225, // lower-left circle (hero stop "advocacia")
    title: 'Helena Duarte Advocacia',
    messages: [
      { time: 'Hoje 09:02', text: 'Pesquisa realizada no TJSP: 14 novas decisões', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 09:02', text: 'Dados baixados automaticamente do PJe e do e-SAJ', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 09:03', text: 'Diário Oficial verificado: 3 publicações dos seus processos', from: 'Agente Southia', side: 'out' },
      { time: 'Hoje 09:03', text: 'Relatório pronto na sua pasta', from: 'Agente Southia', side: 'out' },
    ],
  },
};
const seg = SEGMENTS[process.argv[2] ?? 'barbearia'];
if (!seg) throw new Error(`Unknown stop "${process.argv[2]}" (use ${Object.keys(SEGMENTS).join(' | ')})`);
const OUT = seg.out;
const b64 = (f, type) => `data:${type};base64,${fs.readFileSync(f).toString('base64')}`;
const k4 = b64(`${OUT}/K4.jpg`, 'image/jpeg');
const symbol = fs.readFileSync('src/assets/brand/simbolo-negativa.svg', 'utf8');
const font = (f, w) => `@font-face{font-family:Figtree;font-weight:${w};src:url(${b64(`public/fonts/${f}`, 'font/woff2')}) format('woff2')}`;


const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
const shot = async (name, body, css) => {
  await page.setContent(`<style>${font('figtree-latin.woff2', '400 700')}
    html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#1C3322;font-family:Figtree,sans-serif}
    ${css}</style>${body}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 92 });
  console.log(`${OUT}/${name}.jpg`);
};

// --- K3: deep zoom on the top circle (same geometry as scripts/brand-frames.mjs), photo inside its rim.
await page.setContent(`<div id="s" style="width:1000px;height:1000px">${symbol}</div>`);
const circles = await page.evaluate(() => {
  const svg = document.querySelector('#s svg');
  svg.setAttribute('width', 1000); svg.setAttribute('height', 1000);
  const box = svg.getBoundingClientRect();
  const shapes = [...svg.querySelectorAll('path')].map((p) => ({ r: p.getBoundingClientRect(), fill: p.getAttribute('fill') }));
  const big = Math.max(...shapes.map((s) => s.r.width));
  const people = shapes.filter((s) => s.r.width > big * 0.12 && s.r.width < big * 0.3 && s.fill !== 'none')
    .map((s) => ({ x: (s.r.left + s.r.width / 2 - box.left) / box.width, y: (s.r.top + s.r.height / 2 - box.top) / box.height, d: s.r.width / box.width }));
  return people;
});
const angleOf = (p) => (Math.atan2(p.x - 0.5, 0.5 - p.y) * 180 / Math.PI + 360) % 360;
const top = circles.reduce((best, p) => {
  const diff = Math.min(Math.abs(angleOf(p) - seg.angle), 360 - Math.abs(angleOf(p) - seg.angle));
  return !best || diff < best.diff ? { ...p, diff } : best;
}, null);
const SIZE = 460;
const DOT = H * 0.78; // the circle fills most of the frame: the window is opening
const scale = DOT / (top.d * SIZE);
const tx = (0.5 - top.x) * SIZE * scale;
const ty = (0.5 - top.y) * SIZE * scale;
const WINDOW = DOT * 0.86; // keep the circle's own sage rim visible around the photo
await shot('K3', `<div class="stage">${symbol}</div><div class="window"></div>`, `
  .stage{position:absolute;inset:0;display:grid;place-items:center}
  .stage svg{height:${SIZE}px;width:auto;transform:translate(${tx}px,${ty}px) scale(${scale})}
  .window{position:absolute;left:50%;top:50%;width:${WINDOW}px;height:${WINDOW}px;margin:${-WINDOW / 2}px 0 0 ${-WINDOW / 2}px;
    border-radius:50%;background:url(${k4}) center/cover}`);

// --- K5 / K6: K4 + chat on the right half.
const chat = (n) => `<div class="photo"></div><div class="shade"></div>
  <div class="chat"><div class="title">${seg.title}</div>
  ${seg.messages.slice(0, n).map((m) => `<div class="msg ${m.side}">
    <div class="meta">${m.time}</div><div class="bubble">${m.text}</div><div class="meta">${m.from}</div></div>`).join('')}
  </div>`;
const chatCss = `
  .photo{position:absolute;inset:0;background:url(${k4}) center/cover}
  .shade{position:absolute;inset:0;background:linear-gradient(90deg,transparent 40%,rgba(28,51,34,.55) 62%,rgba(28,51,34,.75))}
  .chat{position:absolute;right:96px;top:120px;width:640px;display:flex;flex-direction:column;gap:22px}
  .title{align-self:center;margin-bottom:6px;padding:10px 26px;border-radius:999px;background:rgba(28,51,34,.85);color:#fff;font-weight:700;font-size:28px;letter-spacing:.01em}
  .msg{display:flex;flex-direction:column;gap:6px;max-width:500px}
  .msg.in{align-self:flex-start}.msg.out{align-self:flex-end;align-items:flex-end}
  .meta{font-size:18px;font-weight:600;color:rgba(255,255,255,.85);text-shadow:0 1px 6px rgba(0,0,0,.5);padding:0 10px}
  .bubble{padding:18px 24px;border-radius:26px;font-size:28px;line-height:1.3;color:#1C3322;box-shadow:0 10px 30px rgba(0,0,0,.28)}
  .in .bubble{background:#fff}.out .bubble{background:#DCF3C8}`;
await shot('K5', chat(2), chatCss);
await shot('K6', chat(4), chatCss);
await browser.close();
