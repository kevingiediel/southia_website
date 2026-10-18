# Media guide — Higgsfield video loops

Every image area on the site is a **media slot** that plays a short, silent, looping video with a poster image. Slots without files show the brand placeholder (green gradient + logo mark), so the site works before any clip exists.

## How a clip gets onto the site

1. Generate a still for the slot (Higgsfield image model) at the slot's aspect ratio.
2. Animate the still into a **3–6 s seamless loop** (Higgsfield image-to-video), calm motion, **no audio**.
3. Save the raw file as `media-src/<slot-id>.mp4` (`.mov` / `.webm` also accepted). `media-src/` is git-ignored.
4. Run `npm run media`. For every raw clip it writes `public/media/<slot-id>.mp4`, `.webm` and `.jpg` (poster = first frame), cropped to the slot size, and warns when a file is over budget.
5. `npm run build` — the check step lists any slots still missing media.

To replace a clip later (e.g. with real Southia footage), drop a new file with the same name into `media-src/` and run `npm run media` again.

**Budget:** ≤ 800 KB per clip; hero circles ≤ 300 KB. If a clip is over budget, trim the raw clip (shorter loop) and re-run.

## Shared style prompt

Use this in every generation, before the slot prompt:

> Warm natural light, contemporary Brazilian small-business settings, brand greens and yellow in wardrobe and props, shallow depth of field, calm motion, no text, no logos.

Expanded for the models:

> Photorealistic, warm natural daylight, contemporary Brazilian small-business setting, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), sage green (#A3C08A) and warm yellow (#F2C230) accents on a cream background, shallow depth of field, soft film grain, calm subtle motion, authentic and friendly mood, no text, no logos, no watermarks.

Motion prompt for image-to-video: *subtle natural movement (blink, small smile, slight head turn or hand gesture), static camera or very slow push-in, seamless loop, no cuts.*

## Slots

| Slot id | Shape | Output size | Alt (pt-BR, shown to screen readers) | Scene prompt |
|---|---|---|---|---|
| hero-p1 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a smiling Brazilian woman in her 30s, curly hair, sage green blouse, centered face |
| hero-p2 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a smiling Brazilian man in his 40s with a short beard, forest green shirt, centered face |
| hero-p3 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a young Black Brazilian woman laughing softly, yellow headscarf, centered face |
| hero-p4 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of an older Brazilian man with grey hair, warm smile, cream knit sweater, centered face |
| hero-p5 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a young Brazilian man with glasses, friendly smile, green polo, centered face |
| hero-p6 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a Brazilian woman in her 50s, short hair, gentle smile, yellow cardigan, centered face |
| hero-p7 | circle 1:1 | 360×360 | Pessoa sorrindo | Close-up portrait of a young Brazilian woman of Japanese descent, bright smile, sage top, centered face |
| row-1 | pill 3:4 | 460×640 | Atendente sorrindo | Customer service attendant with a headset smiling at the camera in a bright small office |
| row-2 | rounded 3:4 | 460×640 | Equipe comemorando | Small team celebrating around a laptop, high-five, cozy coworking space |
| row-3 | pill 3:4 | 460×640 | Cliente feliz no celular | Happy customer looking at a phone, chatting on WhatsApp, café terrace |
| row-4 | rounded 3:4 | 460×640 | Dona de loja | Owner of a small clothing shop behind the counter, confident smile, plants and shelves |
| row-5 | pill 3:4 | 460×640 | Pessoas conversando | Two colleagues talking and laughing over coffee, natural window light |
| row-6 | rounded 3:4 | 460×640 | Equipe no escritório | Team working together at a shared desk in a modern office, focused and relaxed |
| row-7 | pill 3:4 | 460×640 | Pessoa rindo | Person laughing candidly, outdoors in a leafy Brazilian street |
| row-8 | rounded 3:4 | 460×640 | Família / clientes | Family of customers smiling at a neighborhood bakery counter |
| prod-1 | rect 16:10 | 800×500 | Cliente sendo atendido | Customer being helped, phone showing a chat conversation, friendly attendant in the background |
| prod-2 | rect 16:10 | 800×500 | Pessoa criando conteúdo | Creator photographing a product for social media with a phone on a tripod, small studio |
| prod-3 | rect 16:10 | 800×500 | Equipe usando sistemas | Team using laptops and a large screen showing connected dashboards, collaborative |
| prod-4 | rect 16:10 | 800×500 | Pessoa com tempo livre | Relaxed business owner enjoying coffee in a hammock or balcony, laptop closed beside them |
| prod-5 | rect 16:10 | 800×500 | Gestor analisando painel | Manager reviewing charts on a monitor, thoughtful, warm office light |
| prod-6 | rect 16:10 | 800×500 | Cliente confiante | Confident client shaking hands across a desk, documents and a secure-looking laptop |
| como-foto | rounded 4:5 | 800×1000 | Equipe Southia com cliente, sorrindo | Consultants sitting in a circle with a small-business client, smiling, notebooks and laptop, round table |

## Social share image

`public/og-image.jpg`, still, 1200×630, under 300 KB: forest green background with the ring of people (seven small circular portraits around a yellow diamond spark) on the right and the headline **"Pessoas, dados e IA na mesma roda."** in a rounded geometric sans on the left, cream text, yellow accent on "roda".

## Filmes na seção "Veja a Southia"

A seção fica escondida até existir pelo menos um filme. Para publicar um filme, coloque em `public/media/films/`:

| Arquivo | O que é |
|---|---|
| `film-1.jpg` / `film-2.jpg` / `film-3.jpg` | Pôster 16:9 (1280×720). **A existência do pôster é o que faz o card aparecer.** |
| `film-N.mp4` | Vídeo H.264 com áudio, 720p ou 1080p, `+faststart` |
| `film-N.webm` | (opcional) VP9 — usado quando o navegador suporta |
| `film-N.vtt` | (opcional) legendas em pt-BR |

`film-1` = "A roda", `film-2` = "Institucional", `film-3` = "Acelere" (títulos, descrições e durações em `src/data/site.json` → `videos`).

Converter um corte final para o site (exemplo):

```bash
npx ffmpeg-static -i exports/film-2-final.mp4 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/media/films/film-2.mp4
```

As cenas do hero (`public/media/film/<parada>.*`, 720×720) saem de `media-src/film/<parada>.mp4` com `npm run media`.
