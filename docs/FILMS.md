# Filmes Southia — prompts Higgsfield

Todos os vídeos são gerados no Higgsfield (`higgsfield generate create … --wait`), executados por `scripts/generate-films.mjs` a partir de `films/shots.json`. Este documento é a fonte legível dos mesmos prompts.

## Regras que valem para todos os planos

- **Logo:** nunca gerado nem redesenhado pela IA. Todo plano com logo usa quadros exatos renderizados a partir dos SVGs oficiais (`src/assets/brand/`, extraídos de `marca.pdf`) como `--start-image` e/ou `--end-image`. O símbolo **não gira**, não distorce e não recebe sombras ou efeitos; o lugar aberto fica sempre na base (manual, p. 8). Quem se move é a câmera.
- **Texto na tela:** frases em pt-BR que precisam ficar legíveis (chat, Instagram, painel) são criadas primeiro como **imagem** no GPT Image 2.5 (bom com tipografia) e depois animadas com movimento mínimo.
- **Cores:** Verde Mate #1C3322, Verde Erva #3E6A3B, Verde Claro #A3C08A, Centelha #F2C230 (com parcimônia), Creme #F3EEE2.
- **Elenco:** pessoas brasileiras reais e diversas; os mesmos rostos se repetem entre os filmes (stills de referência em `media-src/cast/`).
- **Modelos:** imagens de pessoas → Soul 2.0 (`text2image_soul_v2`, `--quality 2k`); imagens com texto/UI → GPT Image 2.5 (`gpt_image_2_5`); vídeo → Seedance 2.5 (`seedance_2_5`, `--mode omni_reference`, 1080p, sem áudio); som → Seed Audio (`seed_audio`).

### Estilo base (prefixo de todo prompt de imagem com pessoas)

> Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, no text, no logos, no watermarks.

### Estilo base de movimento (sufixo de todo prompt de vídeo)

> Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.

---

## Filme 1 — "A roda" (~50 s, 16:9 + 9:16)

Quadros do logo (exatos, gerados por `scripts/brand-frames.mjs`):
`logo-full` (símbolo centralizado em Verde Mate), `logo-zoom-barbearia` (câmera dentro do círculo do topo), `logo-zoom-clinica` (círculo da direita), `logo-zoom-advocacia` (círculo inferior esquerdo), `logo-zoom-centelha` (centelha no centro).

| Plano | Duração | Entrada | Prompt |
|---|---|---|---|
| F1-01 abertura | 4 s | start=`logo-full`, end=`logo-zoom-barbearia` | Very slow push-in on a flat brand symbol on a deep forest green background toward its top circle. The symbol stays perfectly still and unchanged; only the camera moves. |
| F1-02 entra na barbearia | 4 s | start=`logo-zoom-barbearia`, end=still `F1-barbearia` | The camera flies through the circle opening and lands inside a warm neighbourhood barbershop; seamless match-cut transition through the round shape. |
| F1-03 barbearia | 8 s | start=still `F1-barbearia` | A barber gives a man a fade haircut, friends laugh on the waiting bench, warm afternoon light through the window, clippers buzzing, relaxed joyful mood. Slow dolly left. |
| F1-04 chat | 5 s | start=still `F1-chat` | Close-up of a phone in a customer's hand; the WhatsApp-style chat on screen stays sharp and readable; gentle handheld drift; the barbershop blurred behind. |
| F1-05 volta ao logo | 4 s | start=still `F1-barbearia`, end=`logo-zoom-barbearia` | The camera pulls back out of the barbershop through a circular opening into the flat brand symbol. |
| F1-06 entra na clínica | 4 s | start=`logo-zoom-clinica`, end=still `F1-clinica` | Fly through the right circle of the symbol into a bright physical therapy clinic; seamless round match-cut. |
| F1-07 clínica | 8 s | start=still `F1-clinica` | In a bright physical therapy clinic, a physiotherapist and the receptionist smile at a tablet showing their new Instagram posts; a patient exercises with an elastic band in the background. Slow push-in. |
| F1-08 Instagram | 5 s | start=still `F1-instagram` | Over-the-shoulder close-up of the tablet: a grid of Instagram posts for the clinic is filled automatically, a "Campanha criada automaticamente" card is visible; the physiotherapist's thumbs-up enters frame. |
| F1-09 volta ao logo | 4 s | start=still `F1-clinica`, end=`logo-zoom-clinica` | Pull back out of the clinic through a circular opening into the flat brand symbol. |
| F1-10 entra na advocacia | 4 s | start=`logo-zoom-advocacia`, end=still `F1-advocacia` | Fly through the lower-left circle into a calm law office with wooden shelves; seamless round match-cut. |
| F1-11 advocacia | 8 s | start=still `F1-advocacia` | A lawyer in her 40s leans back with a relieved smile as her monitor updates on its own with new court decisions; colleague brings coffee; late-afternoon light. Slow orbit. |
| F1-12 painel de dados | 5 s | start=still `F1-dados` | Close-up of the monitor: cards from "Diário Oficial", "STJ" and "TJSP" slide into a list with green check marks and the label "Atualizado agora"; subtle screen glow. |
| F1-13 volta ao logo | 4 s | start=still `F1-advocacia`, end=`logo-zoom-centelha` | Pull back out of the office into the flat brand symbol, ending centred on the yellow diamond spark. |
| F1-14 entra na roda | 4 s | start=`logo-zoom-centelha`, end=still `F1-roda` | Push into the yellow diamond, which becomes the glow of a campfire at night; seamless match-cut. |
| F1-15 a roda | 10 s | start=still `F1-roda`, end=`logo-full` | Night in the Brazilian countryside: friends and business owners sit in a circle around a fogo de chão, laughing and talking; one man drinks chimarrão from a gourd; sparks rise. The camera rises slowly above the circle and the scene resolves into the flat brand symbol. |

Stills (antes dos vídeos):

| Still | Modelo | Prompt (após o estilo base) |
|---|---|---|
| `F1-barbearia` | Soul 2.0, 16:9 | Warm neighbourhood barbershop in Porto Alegre, a barber giving a man a fade haircut, two friends laughing on a green bench, vintage mirrors, plants, afternoon sun. |
| `F1-chat` | GPT Image 2.5, 16:9 | Close-up of a smartphone held by a hand in a barbershop, screen shows a WhatsApp-style chat titled "Barbearia do Rafa" with these exact messages: customer (right, light green bubble) "Oi! Tem horário amanhã às 15h?"; business (left, white bubble) "Tem sim! 15h com o Rafa. Confirmo pra você?"; customer "Pode confirmar 👍"; business "Prontinho ✅ Te lembro amanhã." Sharp legible Portuguese text, shallow depth of field. |
| `F1-clinica` | Soul 2.0, 16:9 | Bright physical therapy clinic with wooden floor and plants, a physiotherapist and a receptionist smiling at a tablet, a patient doing elastic band exercises in the background. |
| `F1-instagram` | GPT Image 2.5, 16:9 | Over-the-shoulder close-up of a tablet showing an Instagram profile grid for "Clínica Movimento" filled with nine cohesive green-and-cream posts about posture and exercise, and a floating card reading exactly "Campanha criada automaticamente". Legible Portuguese text. |
| `F1-advocacia` | Soul 2.0, 16:9 | Calm law office with wooden bookshelves, a Brazilian lawyer in her 40s leaning back with a relieved smile in front of a monitor, a colleague bringing coffee, golden late-afternoon light. |
| `F1-dados` | GPT Image 2.5, 16:9 | Close-up of a computer monitor in a law office showing a clean dashboard titled "Jurisprudência" with source cards "Diário Oficial", "STJ", "TJSP" and a list of new decisions with green check marks and the label "Atualizado agora". Legible Portuguese text, deep green and cream interface. |
| `F1-roda` | Soul 2.0, 16:9 | Night in the Rio Grande do Sul countryside, eight people sitting in a circle around a fogo de chão campfire, laughing and talking, one man drinking chimarrão from a cuia with a bomba, warm firelight on faces, sparks rising, starry sky. |

Recortes para o site (hero): F1-03 → `barbearia`, F1-07 → `clinica`, F1-11 → `advocacia`, F1-15 (primeiros 7 s) → `roda`, em 720×720.

Som: `seed_audio` — "Warm acoustic Brazilian guitar and soft percussion, optimistic, building gently, 50 seconds, with subtle clipper buzz at 0:12, a message ping at 0:17, and campfire crackle from 0:40."

---

## Filme 2 — "Institucional" (~45 s, cinematográfico)

| Plano | Duração | Entrada | Prompt |
|---|---|---|---|
| F2-01 amanhecer | 6 s | still `F2-amanhecer` | Dawn over a Brazilian city neighbourhood; a shop owner rolls up a metal shutter; golden light floods the street. Slow crane down. |
| F2-02 padaria | 4 s | still `F2-padaria` | A baker hands warm bread to a smiling regular customer across the counter. |
| F2-03 barbeiro | 4 s | still `F2-barbeiro` (mesmo elenco de F1) | The barber from the barbershop greets a client with a handshake and a laugh. |
| F2-04 fisio | 4 s | still `F2-fisio` (mesmo elenco) | The physiotherapist guides a patient's arm movement, both smiling. |
| F2-05 advogada | 4 s | still `F2-advogada` (mesmo elenco) | The lawyer welcomes a family into her office. |
| F2-06 equipe Southia | 10 s | still `F2-equipe` | Southia team of six in a bright studio, sitting in a circle around a round table with laptops and notebooks, listening to a small-business owner; warm collaborative atmosphere. Slow 180° orbit around the table. |
| F2-07 calma | 7 s | still `F2-calma` | The same businesses at the end of the day, calm: phones buzz with confirmations, owners smile and close up. Gentle montage-like drift. |
| F2-08 assinatura | 6 s | start=`logo-full`, end=`logo-horizontal` | The flat brand symbol on deep forest green; the camera slowly pulls back as the wordmark "southia" settles beside it, ending exactly on the official horizontal logo; the logo itself never changes shape. |

Texto na tela (inserido como imagem GPT Image 2.5 e animado com movimento mínimo, mesmo método do chat): "Todo negócio começa com gente." (F2-01) · "Pessoas, dados e IA…" (F2-06) · "…na mesma roda." (F2-07).

Som: `seed_audio` — "Cinematic, warm, hopeful score with piano and strings, Brazilian acoustic guitar motif, 45 seconds, soft ending."

---

## Filme 3 — "Acelere" (~45 s, estilo lançamento)

| Plano | Duração | Entrada | Prompt |
|---|---|---|---|
| F3-01 sufoco | 6 s | still `F3-sufoco` | Night in a small clothing shop: the owner, tired, scrolls a phone flooded with unanswered messages; spreadsheets on a laptop; cold blue screen light. Slow push-in. |
| F3-02 contador | 4 s | still `F3-contador` (GPT Image 2.5) | Close-up of the phone: notification badge counting up to exactly "47 mensagens sem resposta"; screen glow. |
| F3-03 agente | 6 s | still `F3-agente` (GPT Image 2.5) | Dark green interface on a laptop: an AI agent answers customer messages in seconds, bubbles appear one after another, label "Atendimento 24h". |
| F3-04 campanhas | 6 s | still `F3-campanhas` (GPT Image 2.5) | A grid of social media ads in green and cream generating one by one on screen, label "Campanhas no automático". |
| F3-05 painel | 6 s | still `F3-painel` (GPT Image 2.5) | A sales dashboard with counters climbing and a rising line chart, label "Decisões com dados", yellow accent on the main number. |
| F3-06 manhã | 8 s | still `F3-manha` | Next morning, same owner relaxed with coffee, sunlight, staff serving customers, phone calm on the counter. Overlay label in the image: "Exemplo ilustrativo: +38% vendas · 4h/dia de volta". |
| F3-07 assinatura | 6 s | start=`logo-horizontal`, end=`logo-horizontal-cta` | Flat brand logo on deep forest green; a yellow button reading "Agendar uma conversa" fades in below; the logo stays perfectly still. |

Som: `seed_audio` — "Modern upbeat electronic track with a building rhythm, tense start, release at 0:24, confident ending, 45 seconds, notification pings."

---

## Ordem de geração e portões

1. **Gate 1:** `logo-full`, `logo-zoom-barbearia` → stills `F1-barbearia`, `F1-chat` → vídeos F1-01…F1-05 → recorte do hero `barbearia`. Mostrar ao usuário com a estimativa total de créditos (`higgsfield generate cost …`) antes de seguir.
2. **Gate 2:** demais planos dos três filmes + trilhas; montagem com `scripts/render-film.mjs` (corte e mixagem com ffmpeg, sem alterar os quadros gerados).
