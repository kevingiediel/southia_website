# Southia Website — Design Spec

- **Date:** 2026-10-17
- **Status:** Approved in brainstorming, awaiting written-spec review
- **Source:** `Southia Site.html` (self-unpacking design-tool export, React 18 + DC runtime, 26 inlined woff2 fonts)

## 1. Goal and success criteria

Turn the exported single-file landing page into a maintainable static web project for **Southia** (pt-BR), with richer JavaScript motion, refined visuals, and Higgsfield-generated video loops, deployable to **Hostinger** shared hosting at **southia.com.br**.

Done means:

1. `npm run build` produces a `dist/` folder that, uploaded to `public_html/`, serves the full site over HTTPS on Hostinger with no server-side runtime.
2. All copy, sections, and brand from the source are preserved; content is readable with JavaScript disabled.
3. The motion plan in §5 is implemented and fully disabled under `prefers-reduced-motion`.
4. All 24 media slots accept video loops and degrade to posters/brand placeholders.
5. Lighthouse (mobile) ≥ 90 in Performance, Accessibility, Best Practices, SEO on `npm run preview`.
6. `npm run check` and the Playwright smoke test pass.

### Decisions made

| Topic | Decision |
|---|---|
| Hosting | Hostinger shared (Apache), static upload to `public_html/` |
| Stack | Vite + plain HTML partials + vanilla JS modules + GSAP/ScrollTrigger + Lenis |
| Motion level | "Polished & smooth" (not cinematic pinned scenes) |
| Media | Short muted video loops (MP4 + WebM + poster) in every image slot |
| Clip production | Claude generates via Higgsfield; **samples shown for approval before the full batch** |
| Contact | `mailto:ola@southia.com.br` + WhatsApp link; no form/backend |
| WhatsApp number | Placeholder in `config.js`, clearly marked `TODO` until provided |
| Domain | `southia.com.br` (non-www canonical) |
| Language | pt-BR only; copy unchanged from source except headline highlight markup |

### Out of scope

Real filmed footage, a contact form/backend, multiple pages/blog, English version, CMS, analytics (can be added later with one script tag), cookie banner (not needed without analytics).

## 2. Source inventory (what is being migrated)

- **Brand tokens:** green `#1C3322`, deep green `#152819`, mid green `#2B4A30`, leaf `#3E6A3B`, sage `#A3C08A`, pale sage `#D9E2CC`, yellow `#F2C230`, light yellow `#F7D35E`, cream `#F3EEE2`, paper `#FBF8F1`, line `#E2DBCB` / `#D8D0BE` / `#CFC6B2`, body text `#3A4A3C`.
- **Fonts:** Figtree 400/500/600/700; Montserrat Alternates 400–700 (latin + latin-ext subsets kept; cyrillic/vietnamese dropped).
- **Logo:** `SouthiaSymbol` "hybrid / ring" variant → static SVG with `currentColor`-style CSS variables for ink, ember, bg.
- **Sections:** header (logo, nav: Soluções, Como trabalhamos, CTA Fale com a gente) → Hero `#topo` (eyebrow, h1, lead, 2 CTAs, ring of 7 avatars + "+ você") → Pessoas (h2, lead, 8-item marquee) → Soluções `#solucoes` (6 cards with number, title, text, tags) → Como trabalhamos `#como` (photo + 3 steps) → Contato `#contato` (big logo, h2, text, 2 CTAs) → footer.
- **Existing motion:** bob, orbit, reverse orbit, pulse, spark glow, ping-pong marquee, fade-up reveal. All are re-implemented in GSAP (§5).
- **Dropped:** bundler loader, DC runtime, React/ReactDOM, `image-slot` and `dc-import` custom elements.

## 3. Architecture

```
southia_website/
├─ index.html                  # shell; includes partials
├─ 404.html
├─ src/
│  ├─ partials/                # header, hero, pessoas, solucoes, como, contato, footer, media-slot
│  ├─ data/                    # site.json: solutions, steps, marquee items, slot list (drives partials)
│  ├─ styles/
│  │  ├─ tokens.css            # colors, type scale, spacing, radii, easings, durations
│  │  ├─ base.css              # reset, @font-face, typography, utilities (.sr-only, .container)
│  │  ├─ components.css        # buttons, tags, media slot, cards
│  │  └─ sections/*.css        # one per section
│  ├─ js/
│  │  ├─ main.js               # boot; reduced-motion gate; lazy module init per section
│  │  ├─ config.js             # domain, email, whatsapp (TODO placeholder), motion speed
│  │  ├─ motion/
│  │  │  ├─ smooth-scroll.js   # Lenis + anchor links + ScrollTrigger sync
│  │  │  ├─ header.js          # solid-on-scroll, hide-on-down / show-on-up
│  │  │  ├─ text-reveal.js     # word-mask headline reveals
│  │  │  ├─ reveal.js          # generic staggered fade-up ([data-reveal])
│  │  │  ├─ hero-ring.js       # intro timeline, scroll rotation/parallax, idle loops
│  │  │  ├─ marquee.js         # infinite, velocity-reactive, hover slow-down
│  │  │  ├─ steps.js           # progress line + dot fill + photo parallax
│  │  │  ├─ tilt.js            # card 3D tilt (pointer: fine only)
│  │  │  └─ magnetic.js        # magnetic CTAs (pointer: fine only)
│  │  ├─ ui/mobile-nav.js      # accessible menu toggle
│  │  └─ media/video-slot.js   # lazy load, play/pause, fallback
│  └─ assets/logo/southia-symbol.svg
├─ public/
│  ├─ fonts/*.woff2
│  ├─ media/                   # processed clips + posters (see §6)
│  ├─ favicon.svg, favicon.ico, apple-touch-icon.png, og-image.jpg
│  ├─ .htaccess, robots.txt, sitemap.xml
├─ media-src/                  # raw Higgsfield outputs (git-ignored)
├─ scripts/
│  ├─ process-media.mjs        # ffmpeg: raw → mp4/webm/poster
│  └─ check.mjs                # post-build checks (§8)
├─ tests/smoke.spec.js         # Playwright
├─ docs/  MEDIA.md, DEPLOY.md, superpowers/…
├─ package.json, vite.config.js, playwright.config.js, .gitignore, README.md
```

### Unit responsibilities

- **Partials + data:** `vite-plugin-handlebars` renders partials with `src/data/site.json` as context, so repeated blocks (cards, steps, marquee items, slots) come from data, not copy-paste. The output is one fully static `index.html`.
- **CSS:** no inline styles. Every color, size, and easing comes from `tokens.css`. Hover states are real `:hover`/`:focus-visible` rules.
- **`main.js`:** imports GSAP once and registers ScrollTrigger. If `matchMedia('(prefers-reduced-motion: reduce)')` matches, it initialises only `mobile-nav` and `video-slot` (posters only) and returns. Otherwise it initialises each motion module whose root element exists. Each module exports `init(root, ctx) → cleanup`.
- **Progressive enhancement:** content is visible by default in CSS. JS adds `html.js-motion` *before* first paint (small inline script in `<head>`), and only under that class do reveal targets start hidden. If any module throws, `main.js` catches it, logs it, removes `js-motion`, and content stays visible.
- **Dependencies:** `gsap` (+ ScrollTrigger and SplitText — all free incl. commercial since GSAP 3.13), `lenis`. Dev: `vite`, `vite-plugin-handlebars`, `@playwright/test`, `html-validate`, `ffmpeg-static`.

## 4. Visual design

Same brand, refined:

- **Hero:** radial yellow/sage glow behind the ring; subtle SVG grain overlay on dark sections (≤ 4% opacity); thin "spoke" lines from the central spark to each avatar, echoing the logo.
- **Typography:** tightened fluid scale in tokens; one key word per headline wrapped in `<em class="hl">` and colored yellow (dark sections) or leaf green (light sections) — e.g. "na mesma **roda**", "**Gente** de verdade…", "fazer o seu negócio **girar**", "Tem lugar pra **você** na roda".
- **Cards:** hover gradient border (sage → yellow), media 16:10 with rounded top corners, aligned number dot.
- **Section edges:** curved SVG divider between cream and dark green sections (hero→pessoas, como→contato).
- **Header:** transparent over the hero; solid blurred green after 40px of scroll; hides on scroll down and shows on scroll up. Below 760px the nav collapses into a hamburger with a full-height overlay menu.
- **Buttons/links:** yellow pill buttons with a fill-sweep hover; nav links with an underline that draws in; visible `:focus-visible` ring in yellow.

## 5. Motion specification

All tweens animate `transform`/`opacity` only (plus SVG `stroke-dashoffset` for line drawing). Global speed multiplier comes from `config.motion.speed`.

| Module | Behavior |
|---|---|
| smooth-scroll | Lenis (lerp ≈ 0.1); `a[href^="#"]` scroll via Lenis with header offset; drives `ScrollTrigger.update` |
| header | toggles `.is-solid` past 40px; `yPercent: -100` on downward scroll > 8px, back on upward |
| text-reveal | GSAP SplitText splits `[data-split]` headlines into words wrapped in overflow masks; words rise from 110% with 0.04s stagger, triggered at 80% viewport |
| reveal | `[data-reveal]` batches fade-up 28px, 0.8s, `power3.out`, 0.08s stagger per batch |
| hero-ring | **Intro (on load, ~1.6s):** outer ring draws (dashoffset), avatars scale 0→1 one after another around the circle, spokes draw, spark lights, then h1/lead/CTAs reveal. **Scroll:** while the hero is in view, ring container rotates up to 25° and avatars counter-rotate to stay upright; slight parallax on glow. **Idle loops:** bob, orbit dots, "+ você" pulse, spark glow — paused via ScrollTrigger `toggleActions` when the hero is off-screen |
| marquee | track duplicated for a seamless infinite loop; base speed ~40px/s; scroll velocity adds a temporary boost (clamped); hover eases timeScale to 0.2 |
| steps | vertical progress line scales `scaleY` 0→1 scrubbed across the steps list; each dot fills yellow as the line passes; photo `yPercent` −6→6 parallax |
| tilt | Soluções cards: rotateX/Y ≤ 6° following the pointer, `quickTo` smoothing, reset on leave; only on `(hover: hover) and (pointer: fine)` |
| magnetic | CTA buttons move ≤ 10px toward the pointer within their bounds; elastic return; fine pointer only |
| contato logo | slow 40s rotation of the ring group; ember spark pulse |

Guardrails: `document.visibilitychange` pauses the GSAP ticker when hidden. No animation under reduced motion. Touch devices get no tilt or magnetic effects.

## 6. Media system and Higgsfield production

### Slot markup (partial `media-slot.hbs`)

```html
<figure class="media media--{{shape}}" data-media="{{id}}">
  <video muted loop playsinline preload="none" poster="/media/{{id}}.jpg" aria-hidden="true">
    <source data-src="/media/{{id}}.webm" type="video/webm">
    <source data-src="/media/{{id}}.mp4" type="video/mp4">
  </video>
  <figcaption class="sr-only">{{alt}}</figcaption>
</figure>
```

The base CSS of `.media` is the brand placeholder: green gradient, centered logo mark at 20% opacity. The poster and video cover it when present.

### `video-slot.js`

- `IntersectionObserver` (rootMargin 200px): on the first intersection, copies `data-src` → `src` and calls `load()`; plays when ≥ 25% visible and pauses otherwise.
- Skips video entirely (poster only) under reduced motion or `navigator.connection.saveData`.
- On `error` from the video or the poster, adds `.media--fallback` so the placeholder shows; no broken-image icon.

### Slot inventory

| IDs | Count | Shape | Output size | Clip concept (alt text = original placeholder) |
|---|---|---|---|---|
| hero-p1…p7 | 7 | circle 1:1 | 360×360 | Close-up portraits: diverse Brazilian people smiling, subtle blink/head turn |
| row-1…8 | 8 | pill / rounded, ~3:4 | 460×640 | Atendente sorrindo, Equipe comemorando, Cliente feliz no celular, Dona de loja, Pessoas conversando, Equipe no escritório, Pessoa rindo, Família / clientes |
| prod-1…6 | 6 | rect 16:10 | 800×500 | Cliente sendo atendido, Pessoa criando conteúdo, Equipe usando sistemas, Pessoa com tempo livre, Gestor analisando painel, Cliente confiante |
| como-foto | 1 | rounded 4:5 | 800×1000 | Equipe Southia com cliente, sorrindo |
| og-image | 1 | still 1200×630 | — | Brand composition: ring + people + headline |

### Production workflow

1. `docs/MEDIA.md` holds the shared style prompt (warm natural light, contemporary Brazilian small-business settings, brand greens/yellow in wardrobe and props, shallow depth of field, calm motion, no text, no logos) and one prompt per slot.
2. Generate **stills** (Higgsfield image model) for each slot at the target ratio.
3. Animate stills to **3–6 s seamless loops** (Higgsfield image-to-video), no audio.
4. **Approval gate:** first produce a sample set of 3 (one hero circle, one marquee, one product card) and show them to the user. Generate the remaining 20 only after the user approves the style.
5. Raw files go in `media-src/` (git-ignored). `npm run media` (`scripts/process-media.mjs`, ffmpeg) outputs per slot: `{id}.mp4` (H.264, CRF ~28, no audio, faststart), `{id}.webm` (VP9), `{id}.jpg` poster (first frame), sized per the table.
6. Budget: ≤ 800 KB per clip (hero circles ≤ 300 KB). The script warns when a clip is over budget.

Higgsfield usage spends the user's credits. Estimated at about 23 videos plus 24 stills plus 1 OG still.

## 7. Contact, SEO, deploy

- **Contact:** primary CTA `mailto:ola@southia.com.br?subject=Quero conversar com a Southia`; secondary `https://wa.me/{config.whatsapp}?text=…`. While `whatsapp` is the `TODO` placeholder, the WhatsApp button is hidden and the build prints a warning.
- **Head:** `lang="pt-BR"`, title "Southia — Pessoas, dados e IA na mesma roda", meta description from the hero lead, canonical `https://southia.com.br/`, Open Graph + Twitter card (`og-image.jpg`), `theme-color #1C3322`, JSON-LD `Organization` (name, url, email, logo).
- **Files:** `robots.txt` (allow all, sitemap link), `sitemap.xml` (single URL), favicons from the logo SVG, `404.html` in brand style.
- **Font loading:** preload Figtree 400 latin and Montserrat Alternates 500 latin; `font-display: swap`.
- **`.htaccess`:** force HTTPS and non-www → `https://southia.com.br`; `mod_deflate` (and brotli if available) for html/css/js/svg/json; `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`, `max-age=2592000` for `/media/*` and `/fonts/*`, `no-cache` for `*.html`; `AddType video/webm .webm`; `ErrorDocument 404 /404.html`; headers `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `X-Frame-Options SAMEORIGIN`. Every directive is wrapped in `<IfModule>` so a missing module doesn't cause a 500 error.
- **`docs/DEPLOY.md`:** (a) File Manager: zip the contents of `dist/`, upload to `public_html/`, extract; (b) Git deploy: `npm run deploy:branch` pushes `dist/` to a `deploy` branch, which Hostinger's Git integration pulls into `public_html/`. Includes DNS/SSL notes and a post-deploy checklist.

## 8. Quality and testing

- **`npm run check`** (runs after build):
  - `html-validate` on `dist/*.html`
  - every `href="#x"` has a matching `id`
  - every local `src`/`href` in `dist/` resolves to a file
  - all 24 slot IDs from `site.json` appear as `data-media` in the HTML
  - JS bundle ≤ 60 KB gzipped
  - warns (not fails) for any missing media file or over-budget clip
- **Playwright smoke (`tests/smoke.spec.js`, Chromium, against `vite preview`):**
  1. JS disabled → h1 and all 6 card titles are visible.
  2. `reducedMotion: 'reduce'` → all `[data-reveal]` elements have opacity 1.
  3. 375px viewport → hamburger opens the menu and a link closes it.
  4. Normal load → no console errors.
  5. A slot whose video 404s gets `.media--fallback`.
- **Manual:** Lighthouse mobile on preview (targets in §1); visual pass in the browser at 375px and 1440px; keyboard-only pass of nav and CTAs; contrast check of sage text on cream (adjust to `#3E6A3B` if under 4.5:1).

## 9. Build order

1. Scaffold Vite project and migrate content/fonts/logo as-is (no new motion) — site renders with JS off.
2. Tokens + visual polish (§4), mobile nav.
3. Motion modules (§5) with the reduced-motion gate.
4. Media slot system with placeholders and the `process-media` script.
5. Higgsfield: 3 samples → user approval → remaining clips → process.
6. SEO, `.htaccess`, 404, favicons, deploy docs, `check` + Playwright, Lighthouse pass.
