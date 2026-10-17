# Southia Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the exported Southia landing page as a static Vite project with GSAP motion, Higgsfield video loops, and a `dist/` ready to upload to Hostinger.

**Architecture:** One `index.html` shell assembled at build time from Handlebars partials fed by `src/data/site.json`. Plain CSS with tokens. Vanilla ES modules, one per motion effect, booted by `main.js` behind a reduced-motion gate. Video slots are progressively enhanced `<figure>`s. Output is pure static files plus `.htaccess`.

**Tech Stack:** Node 24, Vite 7, handlebars, gsap 3.13+ (ScrollTrigger, SplitText), lenis, @playwright/test, html-validate, ffmpeg-static, node:test.

**Spec:** `docs/superpowers/specs/2026-10-17-southia-website-design.md`. Read it with this plan; section refs like §5 point there.

## Global Constraints

- All copy is pt-BR and **verbatim** from `reference/original/template.html` (created in Task 1); the only markup change is `<em class="hl">` around one keyword per headline (§4).
- Brand colors only from `src/styles/tokens.css`, values exactly as in spec §2. No inline `style=""` in partials.
- Content must be visible with JS disabled: hidden-before-reveal styles apply only under `html.js-motion`.
- Animate only `transform`, `opacity`, and SVG `stroke-dashoffset`.
- `prefers-reduced-motion: reduce` → no motion modules and no video playback.
- Tilt and magnetic effects only under `(hover: hover) and (pointer: fine)`.
- JS bundle ≤ 60 KB gzipped; clip ≤ 800 KB (hero circles ≤ 300 KB).
- Domain `https://southia.com.br/` (non-www canonical); email `ola@southia.com.br`.
- WhatsApp number is the literal placeholder `TODO_WHATSAPP` in `src/js/config.js` until the user provides it.
- Vite `base: '/'` (site is served from the domain root, `public_html/`).
- Deviation from spec §3: instead of `vite-plugin-handlebars`, use a ~30-line local plugin `vite-plugins/partials.js` built on `handlebars`, to avoid Vite-version peer conflicts. Same behavior.
- Commit after each task; messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Anchor links with a sticky/hiding header:** clicking "Soluções" must land with the section heading not hidden under the header → test in Task 3.
2. **Fonts loading after SplitText runs:** splitting before webfonts load gives wrong word masks/line breaks; reveal must wait for `document.fonts.ready` and keep the headline text intact → test in Task 3.
3. **Autoplay refused** (iOS Low Power Mode, browser policy): `video.play()` rejects. The poster must stay, with no console error and no fallback class → test in Task 6.
4. **Viewport resize / orientation change:** marquee loop width and ScrollTrigger positions must recompute; no console errors after going 1440→375px → test in Task 5.
5. **WhatsApp placeholder shipped by accident:** with `TODO_WHATSAPP`, no `wa.me` link may appear in the built HTML, and the build warns → test in Task 10.

---

## File Map

| Path | Responsibility |
|---|---|
| `reference/original/` | Unpacked source (template.html, SouthiaSymbol.html) for verbatim copy — read-only reference |
| `vite.config.js` | inputs `index.html` + `404.html`, partials plugin |
| `vite-plugins/partials.js` | registers `src/partials/*.hbs`, renders HTML with `site.json` context |
| `src/data/site.json` | all repeated content (§ data shape in Task 1) |
| `src/partials/*.hbs` | header, hero, pessoas, solucoes, como, contato, footer, media-slot, logo |
| `src/styles/{tokens,base,components}.css`, `src/styles/sections/*.css` | styling |
| `src/js/main.js` | boot, gate, module registry, error fallback |
| `src/js/config.js` | site constants + `whatsappUrl()` |
| `src/js/motion/*.js` | one effect each (§5) |
| `src/js/ui/mobile-nav.js` | menu toggle |
| `src/js/media/video-slot.js` | video lazy/play/fallback |
| `scripts/check.mjs` | post-build checks |
| `scripts/process-media.mjs` | raw clip → mp4/webm/jpg |
| `scripts/deploy-branch.mjs` | push `dist/` to `deploy` branch |
| `tests/smoke.spec.js` | Playwright |
| `tests/unit/*.test.js` | node:test for pure helpers |
| `public/` | fonts, media, favicons, og-image, `.htaccess`, robots, sitemap |
| `docs/MEDIA.md`, `docs/DEPLOY.md` | guides |

### Shared interfaces (used across tasks)

```js
// Motion module contract — every file in src/js/motion/ and ui/
export function init(root /* Element */, ctx /* MotionCtx */) { /* … */ return cleanup /* () => void | undefined */ }
// MotionCtx = { gsap, ScrollTrigger, SplitText, lenis /* Lenis | null */, speed /* number, config.motion.speed */, finePointer /* boolean */ }
```

`main.js` registry (selector → module), initialised in this order: `[data-smooth]`→smooth-scroll (root `document.documentElement`), `.site-header`→header, `.mobile-nav`→mobile-nav (always, even reduced), `[data-media]`→video-slot (always), `[data-split]`→text-reveal, `[data-reveal]`→reveal, `#topo`→hero-ring, `.marquee`→marquee, `.steps`→steps, `.cards`→tilt, `[data-magnetic]`→magnetic, `.contato-logo`→contato-logo.

---

### Task 1: Scaffold project and migrate content as-is

**Files:**
- Create: `package.json`, `vite.config.js`, `vite-plugins/partials.js`, `index.html`, `src/data/site.json`, `src/partials/{logo,header,hero,pessoas,solucoes,como,contato,footer,media-slot}.hbs`, `src/styles/{tokens,base,components}.css`, `src/styles/sections/{header,hero,pessoas,solucoes,como,contato,footer}.css`, `src/js/main.js` (empty boot), `src/js/config.js`, `public/fonts/*.woff2`, `reference/original/*`, `.gitignore`, `playwright.config.js`, `tests/smoke.spec.js`, `scripts/check.mjs`, `README.md`
- Test: `tests/smoke.spec.js`, `scripts/check.mjs`

**Interfaces:**
- Produces: `site.json` shape:
  ```json
  { "site": { "url": "https://southia.com.br/", "email": "ola@southia.com.br", "title": "...", "description": "..." },
    "hero":      { "avatars": [ { "id": "hero-p1", "alt": "Pessoa sorrindo", "x": 50, "y": 8 } ] },
    "marquee":   [ { "id": "row-1", "alt": "Atendente sorrindo", "shape": "pill", "h": 320 } ],
    "solutions": [ { "n": "01", "title": "...", "text": "...", "tags": ["WhatsApp"], "media": { "id": "prod-1", "alt": "..." } } ],
    "steps":     [ { "n": "01", "title": "Escutamos", "text": "...", "accent": false } ],
    "como":      { "media": { "id": "como-foto", "alt": "Equipe Southia com cliente, sorrindo" } } }
  ```
  Avatar `x`/`y` are percentage positions copied from the template (50/8, 79.7/20.3, 92/50, 79.7/79.7, 20.3/79.7, 8/50, 20.3/20.3).
- Produces: partial `{{> media-slot id=… alt=… shape=…}}` (`shape` ∈ `circle|pill|rounded|rect`); partial `{{> logo bg="#1C3322"}}` emitting the hybrid/ring SVG with CSS vars `--ink`, `--ember`, `--bg`.
- Produces: section ids `topo`, `solucoes`, `como`, `contato`; classes `.site-header`, `.marquee`, `.marquee__track`, `.cards`, `.card`, `.steps`, `.step`, `.contato-logo`.
- Produces: `scripts/check.mjs` exported `runChecks(distDir) → { errors: string[], warnings: string[] }`; CLI exits 1 if errors.

- [ ] **Step 1: Copy the reference source into the repo.** Run `python -I <scratchpad>/unpack.py "C:/Users/kevin/Downloads/Southia Site.html" reference/original` (the unpacker lives at `C:/Users/kevin/AppData/Local/Temp/claude/C--Users-kevin-Documents-code-southia-website/9003af60-e64b-4792-87aa-bb73fd24cd42/scratchpad/unpack.py`; if missing, recreate it: parse `<script type="__bundler/manifest">` JSON, base64-decode each entry, gunzip when `compressed`, write `<uuid>.<ext>`; write the `__bundler/template` JSON string to `template.html`). Delete the React/runtime JS from `reference/original/` and keep `template.html`, the `text/html` symbol file (rename to `SouthiaSymbol.html`), and the fonts.
- [ ] **Step 2: Move the fonts** to `public/fonts/` with these names (uuid → name): `d8551cb4…`→`figtree-latin.woff2`, `22d4677e…`→`figtree-latin-ext.woff2`, `e3ee7084…`→`montserrat-alt-400-latin.woff2`, `93a53e88…`→`montserrat-alt-400-latin-ext.woff2`, `58aea600…`→`montserrat-alt-500-latin.woff2`, `f4eaa6f5…`→`montserrat-alt-500-latin-ext.woff2`, `dfcd7028…`→`montserrat-alt-600-latin.woff2`, `21c84869…`→`montserrat-alt-600-latin-ext.woff2`, `fb360089…`→`montserrat-alt-700-latin.woff2`, `edcc62f2…`→`montserrat-alt-700-latin-ext.woff2`. Drop the other woff2 (cyrillic/vietnamese). Figtree is variable: one `@font-face` per subset with `font-weight: 400 700`.
- [ ] **Step 3: Init the project.** `npm init -y`; set `"type": "module"`; install `vite gsap lenis` and dev `handlebars @playwright/test html-validate ffmpeg-static`; `npx playwright install chromium`. Scripts: `dev`, `build` (`vite build && node scripts/check.mjs`), `preview` (`vite preview --port 4173 --strictPort`), `check`, `test` (`playwright test`), `test:unit` (`node --test tests/unit`). `.gitignore`: `node_modules/ dist/ media-src/ test-results/ playwright-report/`.
- [ ] **Step 4: Write the failing smoke test** `tests/smoke.spec.js`, using `playwright.config.js` with `webServer: { command: 'npm run build && npm run preview', port: 4173, reuseExistingServer: true }` and `use.baseURL`:
  ```js
  test('content renders with JavaScript disabled', async ({ browser }) => {
    const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Pessoas, dados e IA na mesma roda.');
    await expect(page.locator('.card h3')).toHaveCount(6);
    await expect(page.locator('.card h3').first()).toBeVisible();
    for (const id of ['topo','solucoes','como','contato']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });
  ```
- [ ] **Step 5: Run it.** `npx playwright test -g "JavaScript disabled"` → FAIL (no build / no index.html).
- [ ] **Step 6: Implement the partials plugin** `vite-plugins/partials.js` → `export default function partials({ dir, data }) : import('vite').Plugin`. In `buildStart`/`configureServer`, register every `dir/*.hbs` as a partial named by its basename. In `transformIndexHtml`, `Handlebars.compile(html)(data)`. Add the partial files to `addWatchFile` and send a full reload on change in dev.
- [ ] **Step 7: Migrate content.** Fill `site.json` and the partials by copying copy, structure and order verbatim from `reference/original/template.html`. Replace `image-slot` with `{{> media-slot}}` (no video sources yet; Task 6 adds them), `dc-import SouthiaSymbol` with `{{> logo}}` (SVG from `SouthiaSymbol.html`, hybrid branch, ring form), and `style-hover` with CSS `:hover`. Convert SVG `style="stroke-width:…"` to presentation attributes (`stroke-width="…"`) so `no-inline-style` passes. Port the inline styles to classes in the section CSS files using tokens (§2). `index.html`: `lang="pt-BR"`, viewport meta, title from `site.title`, link `/src/styles/*.css` via one `src/styles/index.css` that imports them, `<script type="module" src="/src/js/main.js">`.
- [ ] **Step 8: Implement `scripts/check.mjs`** with these checks (all errors): `dist/index.html` exists; every `href="#x"` has an element `id="x"`; every root-relative `src`/`href`/`poster`/`data-src` in `dist/*.html` and `dist/assets/*.css` `url()` resolves to a file in `dist/` — `data-src` and `poster` under `/media/` **warn** instead (clips arrive later); every slot id from `site.json` (hero.avatars, marquee, solutions[].media, como.media) appears as `data-media="<id>"` in `dist/index.html`. Run `html-validate dist/*.html` (config `.htmlvalidate.json` extending `html-validate:recommended`, `no-inline-style: error`).
- [ ] **Step 9: Run** `npm run build` → check passes, warnings for media only. `npx playwright test -g "JavaScript disabled"` → PASS.
- [ ] **Step 10: Visual parity check.** `npm run dev` and open in the built-in browser at 1440px; compare section by section with the original rendered from `C:/Users/kevin/Downloads/Southia Site.html`. Layout, copy and colors must match (no motion yet).
- [ ] **Step 11: Commit** `feat: scaffold Vite project and migrate Southia content`.

### Task 2: Design tokens, visual polish, mobile nav

**Files:**
- Modify: `src/styles/tokens.css`, `base.css`, `components.css`, `sections/*.css`, `src/partials/{header,hero,pessoas,como,contato}.hbs`, `src/data/site.json` (headline `hl` words)
- Create: `src/js/ui/mobile-nav.js`, `src/assets/grain.svg`, `src/partials/divider.hbs`
- Modify: `src/js/main.js` (boot mobile-nav)
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Produces: header markup `<header class="site-header"> … <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">` + `<nav id="site-nav" class="mobile-nav">`; `mobile-nav.init(navEl)` toggles `aria-expanded`, `html.nav-open`, closes on link click and `Escape`, returns focus to the toggle.
- Produces: tokens `--ease-out: cubic-bezier(.2,.7,.2,1)`, `--dur-1: .3s`, `--dur-2: .8s`, fluid type `--fs-h1: clamp(44px,6vw,76px)`, `--fs-h2: clamp(32px,4vw,52px)`, `--fs-h2-xl: clamp(36px,5vw,64px)`.
- Produces: `.btn`, `.btn--primary`, `.btn--ghost` (fill sweep via `::before` `scaleX`), `.tag`, `.hl`, `.hero__glow`, `.hero__spokes` (SVG lines centre→each avatar, `stroke: var(--sage)`, opacity .35), `{{> divider from="cream" to="green" flip=false}}`.

- [ ] **Step 1: Write the failing test**
  ```js
  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const toggle = page.locator('.nav-toggle');
    await expect(page.locator('#site-nav a', { hasText: 'Soluções' })).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#site-nav a', { hasText: 'Soluções' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
  ```
- [ ] **Step 2: Run** `npx playwright test -g "mobile menu"` → FAIL (no `.nav-toggle`).
- [ ] **Step 3: Implement the visual polish in §4.** Headline highlight words: h1 "roda", Pessoas h2 "Gente", Soluções h2 "girar", Como h2 "pessoas", Contato h2 "você". Grain overlay as a `::after` background (`grain.svg`, opacity .04) on `.section--dark`. Card hover gradient border via a `::before` mask. Dividers between hero→pessoas and como→contato. Nav collapses below 760px. `:focus-visible` outline `2px solid var(--yellow)`, offset 3px. Check sage `#A3C08A` text on cream; if it's under 4.5:1, use `--leaf` (#3E6A3B) for that text.
- [ ] **Step 4: Implement `mobile-nav.js`** and boot it unconditionally from `main.js`.
- [ ] **Step 5: Run** `npm test` → both tests PASS; `npm run build` check passes (no inline styles).
- [ ] **Step 6: Visual check** in the browser at 375px and 1440px; take screenshots for the task report.
- [ ] **Step 7: Commit** `feat: visual polish, tokens and mobile navigation`.

### Task 3: Motion core: boot, gate, smooth scroll, header, reveals

**Files:**
- Create: `src/js/motion/{smooth-scroll,header,reveal,text-reveal}.js`
- Modify: `src/js/main.js`, `index.html` (inline head script), `src/styles/base.css` (`.js-motion` rules), partials (add `data-split`, `data-reveal`)
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Consumes: module contract and registry (Shared interfaces).
- Produces: inline `<head>` script: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('js-motion')`. `main.js` removes `js-motion` and logs `console.warn('[motion] disabled:', err)` if any module's `init` throws. Each module is wrapped in its own try/catch so one failure does not stop the others.
- Produces: `smooth-scroll.init` creates `new Lenis({ lerp: 0.1 })`, wires `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t*1000))`, and intercepts `a[href^="#"]` → `lenis.scrollTo(target, { offset: -headerHeight })`, where `headerHeight` is `.site-header` `offsetHeight` read at click time. It exposes the instance via `ctx.lenis`, so it must initialise first.
- Produces: header classes `.is-solid` (scrollY > 40) and `.is-hidden` (scrolling down by more than 8px and scrollY > 200); the header is never hidden while `html.nav-open`.
- Produces: `text-reveal` awaits `document.fonts.ready`, then `SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'word' })`; words go `yPercent 110→0`, stagger 0.04, `power3.out`, ScrollTrigger `start: 'top 80%'`, `once: true`. The hero h1 is excluded (`[data-split="hero"]`); hero-ring plays it in Task 4 via the exported `revealWords(el, ctx) → gsap.core.Timeline`.
- Produces: `reveal` uses `ScrollTrigger.batch('[data-reveal]', { onEnter: b => gsap.to(b, { opacity:1, y:0, stagger:.08, duration:.8, ease:'power3.out' }) })`; CSS under `.js-motion [data-reveal] { opacity:0; transform:translateY(28px) }`.

- [ ] **Step 1: Write the failing tests**
  ```js
  test('reduced motion shows all content', async ({ browser }) => {
    const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
    for (const el of await page.locator('[data-reveal]').all()) await expect(el).toHaveCSS('opacity', '1');
  });
  test('no console errors on load and scroll', async ({ page }) => {
    const errors = []; page.on('console', m => m.type() === 'error' && errors.push(m.text())); page.on('pageerror', e => errors.push(e.message));
    await page.goto('/'); await page.mouse.wheel(0, 4000); await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
  test('anchor link lands below the header', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/'); await page.locator('.site-header a[href="#solucoes"]').click(); await page.waitForTimeout(1800);
    const top = await page.locator('#solucoes h2').evaluate(e => e.getBoundingClientRect().top);
    const header = await page.locator('.site-header').evaluate(e => e.getBoundingClientRect().bottom);
    expect(top).toBeGreaterThanOrEqual(Math.max(header, 0));
    expect(top).toBeLessThan(400);
  });
  test('split headlines keep their text', async ({ page }) => {
    await page.goto('/'); await page.locator('#solucoes').scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
    await expect(page.locator('#solucoes h2')).toHaveText('Seis formas de fazer o seu negócio girar.');
    await expect(page.locator('#solucoes h2 .word').first()).toBeVisible();
  });
  ```
- [ ] **Step 2: Run** `npm test` → the new tests FAIL (no `js-motion` / no Lenis offset / no split).
- [ ] **Step 3: Implement** the head script, the `main.js` boot (`gsap.registerPlugin(ScrollTrigger, SplitText)`; reduced-motion → only mobile-nav + video-slot; `document.addEventListener('visibilitychange', …)` pauses/resumes `gsap.ticker` with `lagSmoothing`) and the four modules per the Interfaces block.
- [ ] **Step 4: Run** `npm test` → all PASS.
- [ ] **Step 5: Manual check** in the browser: smooth scroll, header hides/shows, reveals fire once, no layout jump on font load.
- [ ] **Step 6: Commit** `feat: motion core with smooth scroll, header and reveals`.

### Task 4: Hero ring

**Files:**
- Create: `src/js/motion/hero-ring.js`
- Modify: `src/partials/hero.hbs` (SVG ring circle with `pathLength="1"`, spokes, glow, `data-*` hooks), `src/styles/sections/hero.css`
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Consumes: `revealWords(el, ctx)` from `text-reveal.js`; `ctx.speed`.
- Produces: `hero-ring.init(heroSection, ctx) → cleanup`. Hooks: `.hero__ring-svg circle` (outer ring), `.hero__rotor` (rotating container), `.hero__avatar` ×7 (each with inner `[data-bob]`), `.hero__spokes line` ×7, `[data-spark]`, `[data-orbit]`, `[data-orbit-rev]`, `[data-pulse]`, `.hero__copy > *`. Sets `heroSection.dataset.introDone = "true"` when the intro timeline completes.

- [ ] **Step 1: Write the failing test**
  ```js
  test('hero intro completes and loops pause off-screen', async ({ page }) => {
    await page.goto('/?debug');
    await expect(page.locator('#topo')).toHaveAttribute('data-intro-done', 'true', { timeout: 4000 });
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('#contato').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    const paused = await page.evaluate(() => window.__southia?.heroLoops?.every(t => t.paused()));
    expect(paused).toBe(true);
  });
  ```
  `main.js` exposes `window.__southia = { heroLoops }` only when `new URLSearchParams(location.search).has('debug')` (works in the production preview build). The test's `goto` is `'/?debug'`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** per §5: the intro timeline (ring dashoffset 1→0 over 0.9s; avatars `scale 0→1`, `back.out(1.6)`, stagger 0.08 in DOM order around the circle; spokes draw; spark `scale 0→1` with glow; then `revealWords(h1)`, lead and CTAs fade up), about 1.6s total ÷ `ctx.speed`. Scroll: `ScrollTrigger` on `#topo`, `scrub: true`, rotor `rotate 0→25`, each avatar `rotate 0→-25`, glow `yPercent 0→15`. Idle loops keep the original durations (bob 2400ms alternate with −420ms·i delay; orbit 9s; reverse orbit 6s; pulse 1.1s; spark 1.6s), all ÷ speed. They live in `heroLoops[]` and play/pause through a ScrollTrigger `onToggle` on `#topo`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Manual check** in the browser: intro feels smooth at 1440px and 375px; avatars stay upright while rotating.
- [ ] **Step 6: Commit** `feat: animated hero ring`.

### Task 5: Marquee, steps, tilt, magnetic, contato logo

**Files:**
- Create: `src/js/motion/{marquee,steps,tilt,magnetic,contato-logo}.js`
- Modify: `src/partials/{pessoas,como,contato,header,hero}.hbs` (hooks, `data-magnetic` on `.btn--primary`), section CSS
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Produces: `marquee.init(el, ctx)`: on init, duplicates the `.marquee__track` children once (`aria-hidden="true"` on clones) and builds a `gsap.to(track, { xPercent: -50, repeat: -1, ease: 'none', duration: (trackWidth/2)/40 / speed })`. `ScrollTrigger.create({ onUpdate: self => timeScale = 1 + clamp(|self.getVelocity()|/600, 0, 3) })` easing back to 1 over 0.6s; hover → `gsap.to(tl, { timeScale: 0.2 })`. It rebuilds on `ScrollTrigger` `refreshInit` (resize) without duplicating twice: clones are tagged `data-clone`, removed and re-added.
- Produces: `steps.init(el, ctx)`: `.steps__line` `scaleY 0→1` (`transform-origin: top`) scrubbed from `top 70%` to `bottom 60%`; each `.step` gets `.is-active` when the line passes its dot; `.como__media` `yPercent -6→6` scrub.
- Produces: `tilt.init(cardsEl, ctx)` (no-op unless `ctx.finePointer`): per `.card`, `gsap.quickTo` on `rotationX`/`rotationY` (±6°, `transformPerspective: 900`), reset on `pointerleave`.
- Produces: `magnetic.init(btn, ctx)` (no-op unless `ctx.finePointer`): translate up to 10px toward the pointer; `elastic.out(1, .4)` return.
- Produces: `contato-logo.init(el, ctx)`: logo ring group rotates 360° every 40s/speed; ember `scale 1→1.15` yoyo 1.6s/speed; paused off-screen.

- [ ] **Step 1: Write the failing tests**
  ```js
  test('marquee loops seamlessly and survives resize', async ({ page }) => {
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
    const items = page.locator('.marquee__track > *');
    await expect(items).toHaveCount(16);
    await page.setViewportSize({ width: 375, height: 812 }); await page.waitForTimeout(800);
    await expect(items).toHaveCount(16);
    expect(errors).toEqual([]);
  });
  test('steps activate on scroll', async ({ page }) => {
    await page.goto('/'); await page.locator('.steps').scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 600); await page.waitForTimeout(1000);
    await expect(page.locator('.step.is-active').first()).toBeVisible();
  });
  ```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the five modules per the Interfaces block.
- [ ] **Step 4: Run** `npm test` → all PASS.
- [ ] **Step 5: Manual check** with a mouse: tilt and magnetic feel subtle; with touch emulation (375px preset) there's no tilt or magnetic effect.
- [ ] **Step 6: Commit** `feat: marquee, steps, tilt, magnetic and contato logo motion`.

### Task 6: Media slot system

**Files:**
- Create: `src/js/media/video-slot.js`, `public/media/.gitkeep`
- Modify: `src/partials/media-slot.hbs` (full markup from spec §6), `src/styles/components.css` (`.media`, shapes, `.media--fallback`, `.media--ready`), `src/js/main.js`
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Produces: `video-slot.init(document, { reduced: boolean })`. For each `[data-media] video`: if `reduced || navigator.connection?.saveData` → never set `src` (poster only). Otherwise an IntersectionObserver (`rootMargin: '200px'`) copies `source[data-src]` → `src` and calls `video.load()` on first sight. A second observer (`threshold: 0.25`) calls `video.play().catch(() => {})` / `video.pause()`. On `loadeddata` it adds `.media--ready`. On an `error` event from the last `<source>`, or the poster failing to load (check via `new Image()` of the poster URL), it adds `.media--fallback` to the figure.
- Base `.media` style = brand placeholder (green gradient `--green`→`--green-mid`, centred logo mark at 20% opacity via `::before`). `video` covers it with `object-fit: cover` and stays `opacity: 0` until `.media--ready` or the poster has loaded.

- [ ] **Step 1: Write the failing tests**
  ```js
  test('missing media falls back to placeholder', async ({ page }) => {
    await page.goto('/'); const slot = page.locator('[data-media="prod-1"]');
    await slot.scrollIntoViewIfNeeded();
    await expect(slot).toHaveClass(/media--fallback/, { timeout: 4000 });
  });
  test('rejected autoplay keeps poster quietly', async ({ page }) => {
    const errors = []; page.on('console', m => m.type() === 'error' && errors.push(m.text())); page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('NotAllowedError')); });
    await page.route('**/media/hero-p1.*', r => r.fulfill({ path: `tests/fixtures/tiny.${new URL(r.request().url()).pathname.split('.').pop()}` }));
    await page.goto('/'); await page.waitForTimeout(1500);
    await expect(page.locator('[data-media="hero-p1"]')).not.toHaveClass(/media--fallback/);
    expect(errors.filter(e => !e.includes('404'))).toEqual([]);
  });
  ```
  Create `tests/fixtures/tiny.{mp4,webm,jpg}` with `ffmpeg-static`: a 1s 64×64 green clip and its first frame.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the partial markup, CSS and `video-slot.js` per Interfaces. Extend `check.mjs` so that `/media/` poster/source references warn when missing and error only when the referenced slot id is unknown.
- [ ] **Step 4: Run** `npm test` → all PASS.
- [ ] **Step 5: Commit** `feat: lazy video media slots with brand fallback`.

### Task 7: Media pipeline and brief

**Files:**
- Create: `scripts/process-media.mjs`, `docs/MEDIA.md`, `tests/unit/process-media.test.js`
- Modify: `package.json` (`"media": "node scripts/process-media.mjs"`)

**Interfaces:**
- Produces: `export const SIZES = { circle: [360,360], pill: [460,640], rounded: [460,640], rect: [800,500], como: [800,1000] }`; `export const BUDGET = { circle: 300_000, default: 800_000 }`; `export function slotSpec(id, site) → { id, shape, width, height, budget }` (`como-foto` → `como`, hero → `circle`, marquee → its shape, prod → `rect`; unknown id → throws `Error('Unknown slot: <id>')`); `export function ffmpegArgs(input, spec, format /* 'mp4'|'webm'|'jpg' */) → string[]`.
- CLI: for every `media-src/<id>.(mp4|mov|webm)` it writes `public/media/<id>.mp4` (`-c:v libx264 -crf 28 -preset slow -an -movflags +faststart -pix_fmt yuv420p`), `.webm` (`-c:v libvpx-vp9 -crf 38 -b:v 0 -an`) and `.jpg` (`-frames:v 1 -q:v 3`). All are scaled and centre-cropped to the size (`scale=W:H:force_original_aspect_ratio=increase,crop=W:H`). It prints a table of sizes and `⚠ over budget` for files above `budget`.

- [ ] **Step 1: Write failing unit tests:** `slotSpec('hero-p3', site)` → `{ shape:'circle', width:360, height:360, budget:300000 }`; `slotSpec('row-2', site).shape === 'rounded'`; `slotSpec('como-foto', site)` → 800×1000; `slotSpec('nope', site)` throws `/Unknown slot/`; `ffmpegArgs('a.mp4', spec, 'mp4')` includes `'-an'`, `'+faststart'` and `crop=360:360`.
- [ ] **Step 2: Run** `npm run test:unit` → FAIL.
- [ ] **Step 3: Implement** using `ffmpeg-static` for the binary path and `child_process.spawnSync`.
- [ ] **Step 4: Run** `npm run test:unit` → PASS. Run `cp tests/fixtures/tiny.mp4 media-src/prod-1.mp4 && npm run media` → three files in `public/media/`. Then delete them.
- [ ] **Step 5: Write `docs/MEDIA.md`:** the shared style prompt (§6 step 1, verbatim), a table of the 24 slots with id, shape, size and a one-line pt-BR scene prompt derived from each slot's `alt`, the og-image brief, the naming rule `media-src/<id>.<ext>`, and how to run `npm run media`.
- [ ] **Step 6: Commit** `feat: media processing pipeline and Higgsfield brief`.

### Task 8: Higgsfield sample set (APPROVAL GATE)

**Files:**
- Create: `media-src/{hero-p1,row-1,prod-1}.*` (git-ignored), `public/media/{hero-p1,row-1,prod-1}.{mp4,webm,jpg}`

- [ ] **Step 1: Load the `higgsfield-generate` skill** and follow it for model choice and CLI usage.
- [ ] **Step 2: Generate one still each** for `hero-p1` (1:1), `row-1` (3:4) and `prod-1` (16:10) from the `docs/MEDIA.md` prompts.
- [ ] **Step 3: Animate each still** with image-to-video into a 3–6 s loop with calm motion and no audio. Download the files to `media-src/<id>.mp4`.
- [ ] **Step 4: Run** `npm run media`. Each output must be within budget; otherwise trim the raw clip (`ffmpeg -i in.mp4 -t 4 -c copy out.mp4` via `ffmpeg-static`) and re-run.
- [ ] **Step 5: Show the user** the three clips in place: run `npm run dev`, open the built-in browser, screenshot the hero, marquee and first card. Report the credits used.
- [ ] **Step 6: STOP.** Ask the user to approve the style or request changes. Do not start Task 9 until they explicitly approve. Any style changes go into `docs/MEDIA.md` before regenerating.
- [ ] **Step 7: Commit** (after approval) `feat: Higgsfield sample clips` with the `public/media` files and any `MEDIA.md` changes.

### Task 9: Remaining clips and OG image

**Files:**
- Create: `public/media/<20 remaining ids>.{mp4,webm,jpg}`, `public/og-image.jpg`

- [ ] **Step 1: Generate and animate** the remaining 20 slots exactly as in Task 8 steps 2–3, using the approved style.
- [ ] **Step 2: Generate `og-image`** as a still at 1200×630 (ring of people + the headline "Pessoas, dados e IA na mesma roda." in the brand style). Save it as `public/og-image.jpg`, under 300 KB.
- [ ] **Step 3: Run** `npm run media && npm run build`. The check output must show **no** media warnings and no over-budget clips.
- [ ] **Step 4: Run** `npm test` → all PASS. The `missing media falls back` test now needs a slot without media: change it to `page.route('**/media/prod-1.*', r => r.fulfill({ status: 404 }))` before `goto`.
- [ ] **Step 5: Commit** `feat: full Higgsfield media set and OG image`.

### Task 10: SEO, contact links, Hostinger deploy files

**Files:**
- Create: `404.html`, `public/{.htaccess,robots.txt,sitemap.xml,favicon.svg,favicon.ico,apple-touch-icon.png}`, `scripts/deploy-branch.mjs`, `docs/DEPLOY.md`, `tests/unit/config.test.js`
- Modify: `index.html` (head meta, font preloads, JSON-LD), `src/js/config.js`, `vite-plugins/partials.js` (pass `whatsappUrl` into data), `src/partials/contato.hbs`, `vite.config.js` (404 input), `scripts/check.mjs` (bundle size), `package.json` (`deploy:branch`)
- Test: `tests/unit/config.test.js`, `scripts/check.mjs`, `tests/smoke.spec.js`

**Interfaces:**
- Produces: `config.js`: `export const WHATSAPP = 'TODO_WHATSAPP'`; `export function whatsappUrl(number, text) → string | null`. It returns `null` when `number` is falsy or starts with `TODO`. Otherwise it returns `https://wa.me/<digits only>?text=<encodeURIComponent(text)>`. Default text: `Olá! Quero conversar com a Southia.`. The partials plugin logs `⚠ WhatsApp number is a placeholder — button hidden` during the build when the result is null.
- Contato CTAs: primary `mailto:ola@southia.com.br?subject=Quero%20conversar%20com%20a%20Southia`; secondary WhatsApp `{{#if whatsappUrl}}`; tertiary the email address as text link (as in the original).

- [ ] **Step 1: Write failing tests.** Unit: `whatsappUrl('TODO_WHATSAPP','x') === null`; `whatsappUrl('','x') === null`; `whatsappUrl('+55 (11) 99999-0000','Olá!') === 'https://wa.me/5511999990000?text=Ol%C3%A1!'`. Add to `check.mjs` (errors): `dist/index.html` contains no `wa.me/TODO`; `<link rel="canonical" href="https://southia.com.br/">` is present; `og:image` is present; `dist/.htaccess`, `robots.txt`, `sitemap.xml` and `404.html` exist; the total gzipped size of `dist/assets/*.js` is ≤ 61_440 bytes (computed with `zlib.gzipSync`). Playwright: `await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0)`.
- [ ] **Step 2: Run** `npm run test:unit && npm run build` → FAIL.
- [ ] **Step 3: Implement the head** per §7: title `Southia — Pessoas, dados e IA na mesma roda`, description = the hero lead, canonical, OG and Twitter tags (`summary_large_image`, absolute `https://southia.com.br/og-image.jpg`), `theme-color #1C3322`, JSON-LD Organization, preloads for `figtree-latin.woff2` and `montserrat-alt-500-latin.woff2` (`crossorigin`). Favicons come from the logo SVG (render the PNG/ICO once with Playwright `page.screenshot` of the SVG at 180px and 32px; commit the outputs).
- [ ] **Step 4: Write `.htaccess`** per §7, every block wrapped in `<IfModule>`. Write `robots.txt` (`Allow: /`, `Sitemap: https://southia.com.br/sitemap.xml`), `sitemap.xml` (one `<url>` with `lastmod` = build date), and `404.html` (brand dark section, logo, "Página não encontrada", link home).
- [ ] **Step 5: Implement `scripts/deploy-branch.mjs`:** run `npm run build`, then `git worktree add -f .deploy deploy` (create an orphan branch if missing), replace its contents with `dist/` (including dotfiles), commit `deploy: <short sha>`, and remove the worktree. **Do not push**; print `git push origin deploy` for the user. Write `docs/DEPLOY.md` covering the File Manager route, the Git deploy route, setting the WhatsApp number, DNS/SSL on Hostinger (enable the free SSL, then the `.htaccess` redirect takes over) and a post-deploy checklist (HTTPS, www→non-www, 404 page, OG preview via a share debugger, videos play on a phone).
- [ ] **Step 6: Run** `npm run test:unit && npm run build && npm test` → all PASS.
- [ ] **Step 7: Commit** `feat: SEO, contact links and Hostinger deploy setup`.

### Task 11: Final verification

- [ ] **Step 1: Run** `npm run build && npm run test:unit && npm test` → all green; paste the summary into the report.
- [ ] **Step 2: Lighthouse:** with `npm run preview` running, run `npx lighthouse http://localhost:4173 --preset=perf --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lighthouse.json --chrome-flags="--headless"` (temporary `npx`, not a dependency). Every category must be ≥ 0.90. Fix any regressions in the owning task's files and commit them as `fix:`. Don't commit `lighthouse.json`.
- [ ] **Step 3: Manual pass** in the built-in browser at 375px and 1440px: every section, keyboard-only tab through nav and CTAs, the reduced-motion emulation, and the JS-off view. Screenshot each for the report.
- [ ] **Step 4: Update `README.md`** with a project overview, scripts, where to edit copy (`src/data/site.json`, partials), how to swap media, and links to `docs/MEDIA.md` and `docs/DEPLOY.md`.
- [ ] **Step 5: Commit** `docs: README and final verification`.

---

## Amendment (2026-10-17): films — replaces Tasks 8 and 9

Spec §10 replaces the 3 generic sample loops with three films. Tasks 8–9 are superseded by Tasks 12–17; Task 11 (final verification) runs last, after Task 17.

### Shared interfaces (films)

```js
// site.json
"film": { "stops": [ { "id": "barbearia", "circle": 0, "overlay": "chat", "tag": "Agentes de atendimento" },
                     { "id": "clinica",   "circle": 2, "overlay": "instagram", "tag": "Criativos e campanhas" },
                     { "id": "advocacia", "circle": 4, "overlay": "dados", "tag": "Dados e IA" },
                     { "id": "roda",      "circle": "spark", "overlay": "headline", "tag": "" } ],
          "chat": [ { "from": "cliente", "text": "Oi! Tem horário amanhã às 15h?" }, … ] }
// src/js/motion/hero-film.js
export function stopSchedule(stops, { zoomIn = 1.1, dwell = 7, zoomOut = 0.9, rest = 1.2 } = {}) // → [{ id, start, end }] seconds, contiguous, total = loop length
export function init(heroSection, ctx) // waits for 'hero:intro-done', builds a repeating timeline; sets heroSection.dataset.filmStop = id | 'ring'
// Clips: /media/film/<stop-id>.{webm,mp4,jpg}, 720×720
```

### Task 12: Hero film engine + chat overlay

**Files:** Create `src/js/motion/hero-film.js`, `src/partials/hero-film.hbs`, `src/styles/sections/hero-film.css`, `tests/unit/hero-film.test.js`. Modify `hero.hbs`, `hero-ring.js` (dispatch `hero:intro-done` on the section), `main.js`, `site.json`, `smoke.spec.js`.

- [ ] Unit (RED first): `stopSchedule` returns 4 contiguous entries in stop order; first start 0; each length = zoomIn+dwell+zoomOut+rest; total = 4× that.
- [ ] Playwright (RED first), clips routed to fixtures, `/?debug&filmspeed=10`: records `data-film-stop` changes → sequence contains `barbearia, ring, clinica, ring, advocacia, ring, roda, ring` in order; pause button sets `aria-pressed="true"` and `data-film-stop` stops changing for 1.5s; reduced motion → no `.hero-film` playback and no `/media/film/` requests; no `/media/film/` request before `hero:intro-done`.
- [ ] Implement: window = circular `.hero-film__window` the size of the outer ring; zoom = transform-only (scale + translate from the circle's centre, `x/y` from site.json avatar positions; spark = centre); scene `<video>` per stop with `data-src`, src set on enter, next stop prefetched; chat overlay types messages in sequence (typing dots → bubble); tag chip per stop; pause/play button (`aria-pressed`, label "Pausar animação"/"Retomar animação"); pauses when hero off-screen.
- [ ] Commit `feat: hero film engine with chat overlay`.

### Task 13: Gate 1 — barbershop sample (APPROVAL GATE)

- [ ] Load `higgsfield-generate`; generate the barbershop still (Soul 2.0, 16:9, prompt from MEDIA.md film section), then Seedance 2.5 image-to-video 6–8 s, no audio; save `media-src/film/barbearia.mp4`.
- [ ] Extend `npm run media` for `media-src/film/*` → `public/media/film/<id>.{mp4,webm,jpg}` 720×720 centre crop, budget 1.2 MB (unit test `slotSpec('film/barbearia')` first).
- [ ] Run `higgsfield generate cost` for the full shot list (spec §10) and total it.
- [ ] Show the user: hero screenshots/recording of stop 1, the raw still, credit estimate. **STOP until approved.**

### Task 14: Remaining overlays — Instagram grid, data feed, headline

- [ ] Playwright RED: each stop's overlay becomes visible during its stop (`.overlay--instagram`, `.overlay--dados`, `.overlay--headline`).
- [ ] Implement overlays in `hero-film.hbs` + CSS + timeline hooks. Commit.

### Task 15: Remaining footage + audio (Gate 2 prep)

- [ ] Generate clinic, law office, fireside (Film 1); Film 2 ×6 shots; Film 3 ×3 shots; 7 portrait loops for hero circles; music beds ×3 and SFX. Raw files in `media-src/`, processed via `npm run media`.
- [ ] Rough cuts of Films 2/3 via Task 17's renderer (draft quality). **STOP for Gate 2 review.**

### Task 16: "Veja a Southia" section + film player

- [ ] Playwright RED: two `.film-card`s; click opens `dialog.film-player` with a `<video controls>` whose src is set only on open; focus moves into the dialog; Esc closes; focus returns to the card; no `/media/films/` request before click.
- [ ] Implement with native `<dialog>` (`showModal()` gives focus trap + Esc), captions `<track kind="captions" srclang="pt-BR">`. Commit.

### Task 17: Composition pages, renderer, exports, slot loops

- [ ] Unit RED: `renderArgs({ fps: 30, size: [1920,1080] })` builds the ffmpeg image2pipe → H.264 command with `-r 30`, `-pix_fmt yuv420p`, audio mux when given.
- [ ] `films/film-1.html` (reuses hero-film timeline, deterministic `?render` mode driven by `gsap.globalTimeline.seek`), `films/film-2.html`, `films/film-3.html`; `scripts/render-film.mjs` steps frames via Playwright screenshots → ffmpeg; outputs `exports/film-{1,2,3}-{16x9,9x16}.mp4` (git-ignored) and web versions `public/media/films/film-{2,3}.{mp4,webm,jpg}`.
- [ ] Cut slot loops from the footage into `media-src/<slot-id>.mp4` and run `npm run media`; `npm run build` shows no missing media. Commit.
