# Prompts dos filmes Southia — para rodar direto no Higgsfield

Gerado de `films/shots.json` por `films/export-prompts.py`. Não edite à mão: mude `films/build-shots.py` e rode os dois scripts.

## Como usar

1. **Gere as imagens de cada filme primeiro.** Elas viram o quadro inicial/final dos vídeos. Salve cada uma com o nome indicado (ex.: `F1-barbearia.png`) em `media-src/films/`.
2. **Vídeos: Seedance 2.5**, modo com quadros (start/end frame), proporção **16:9**, resolução **720p**, **áudio desligado**, duração indicada em cada plano. Envie como *Start frame* e *End frame* os arquivos indicados.
3. **Quadros do logo** (`media-src/frames/logo-*.png`) são renderizados dos SVGs oficiais do manual. Use exatamente esses arquivos; nunca gere o logo com IA. Se faltarem, rode `npm run brand:frames`.
4. **Trilhas: Seed Audio 1.0.**
5. Salve cada vídeo como `media-src/films/<ID>.mp4` (ex.: `F1-03.mp4`) para eu montar os cortes e o site.

Custo estimado (720p): ~7 créditos por segundo de vídeo; imagens 0,12–0,5; trilhas 1,2.

---

## Filme 1 — "A roda" (hero) · 81s de vídeo

### Imagens

#### F1-barbearia — REFAZER — capa sem estampa (o "RATI" saiu na capa)
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F1-barbearia.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Warm neighbourhood barbershop in Porto Alegre, a barber giving a man a fade haircut under a plain dark green barber cape with no print, two friends laughing on a green bench, vintage mirrors, plants, afternoon sun.
```

#### F1-chat — PRONTO — já gerado, texto perfeito
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F1-chat.png`
- **Prompt:**

```text
Photorealistic close-up of a smartphone held by a hand in a warm barbershop, shallow depth of field. The screen shows a WhatsApp-style chat titled "Barbearia do Rafa" with exactly these messages, in order: customer on the right in a light green bubble "Oi! Tem horário amanhã às 15h?"; business on the left in a white bubble "Tem sim! 15h com o Rafa. Confirmo pra você?"; customer "Pode confirmar 👍"; business "Prontinho ✅ Te lembro amanhã." Perfectly legible Brazilian Portuguese text, no other text.
```

#### F1-clinica
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F1-clinica.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Bright physical therapy clinic with wooden floor and plants, a physiotherapist and a receptionist smiling at a tablet, a patient doing elastic band exercises in the background.
```

#### F1-instagram
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F1-instagram.png`
- **Prompt:**

```text
Photorealistic over-the-shoulder close-up of a tablet in a bright physiotherapy clinic. The screen shows an Instagram profile grid for "Clínica Movimento" with nine cohesive green-and-cream posts about posture and exercise, and a floating card that reads exactly "Campanha criada automaticamente". Perfectly legible Brazilian Portuguese text, no other text.
```

#### F1-advocacia
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F1-advocacia.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Calm law office with wooden bookshelves, a Brazilian lawyer in her 40s leaning back with a relieved smile in front of a monitor, a colleague bringing coffee, golden late-afternoon light.
```

#### F1-dados
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F1-dados.png`
- **Prompt:**

```text
Photorealistic close-up of a computer monitor in a law office. The screen shows a clean dashboard titled "Jurisprudência" with source cards "Diário Oficial", "STJ" and "TJSP" and a list of new decisions with green check marks and the label "Atualizado agora". Deep green and cream interface. Perfectly legible Brazilian Portuguese text, no other text.
```

#### F1-roda
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F1-roda.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Night in the Rio Grande do Sul countryside, eight people sitting in a circle around a fogo de chão campfire, laughing and talking, one man drinking chimarrão from a cuia with a bomba, warm firelight on faces, sparks rising, starry sky.
```

### Vídeos

#### F1-01 — REFAZER — sem fumaça no fundo
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-full.png`
- **End frame:** `media-src/frames/logo-zoom-barbearia.png`
- **Salvar como:** `media-src/films/F1-01.mp4`
- **Prompt:**

```text
Very slow push-in on a flat brand symbol on a deep forest green background toward its top circle. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-02 — REFAZER — depois do novo F1-barbearia (sem brilho no círculo)
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-zoom-barbearia.png`
- **End frame:** `media-src/films/F1-barbearia.png`
- **Salvar como:** `media-src/films/F1-02.mp4`
- **Prompt:**

```text
The camera flies through the round circle of the flat graphic and lands inside a warm neighbourhood barbershop; seamless match-cut transition through the round shape. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-03 — REFAZER — depois do novo F1-barbearia
- **Modelo:** Seedance 2.5 · **Duração:** 8s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-barbearia.png`
- **Salvar como:** `media-src/films/F1-03.mp4`
- **Prompt:**

```text
A barber gives a man a fade haircut, friends laugh on the waiting bench, warm afternoon light through the window, relaxed joyful mood. Slow dolly left. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-04 — PRONTO — já gerado
- **Modelo:** Seedance 2.5 · **Duração:** 5s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-chat.png`
- **Salvar como:** `media-src/films/F1-04.mp4`
- **Prompt:**

```text
Close-up of a phone in a customer's hand; the chat on screen stays sharp, unchanged and readable; gentle handheld drift; the barbershop blurred behind. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-05 — REFAZER — depois do novo F1-barbearia
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-barbearia.png`
- **End frame:** `media-src/frames/logo-zoom-barbearia.png`
- **Salvar como:** `media-src/films/F1-05.mp4`
- **Prompt:**

```text
The camera pulls back out of the barbershop through a circular opening and lands on the flat brand symbol, ending exactly on the provided final frame. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-06
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-zoom-clinica.png`
- **End frame:** `media-src/films/F1-clinica.png`
- **Salvar como:** `media-src/films/F1-06.mp4`
- **Prompt:**

```text
Fly through the right circle of the flat graphic into a bright physical therapy clinic; seamless round match-cut. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-07
- **Modelo:** Seedance 2.5 · **Duração:** 8s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-clinica.png`
- **Salvar como:** `media-src/films/F1-07.mp4`
- **Prompt:**

```text
In a bright physical therapy clinic, a physiotherapist and the receptionist smile at a tablet showing their new Instagram posts; a patient exercises with an elastic band in the background. Slow push-in. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-08
- **Modelo:** Seedance 2.5 · **Duração:** 5s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-instagram.png`
- **Salvar como:** `media-src/films/F1-08.mp4`
- **Prompt:**

```text
Over-the-shoulder close-up of the tablet; the Instagram grid and the card stay sharp and unchanged; the physiotherapist's thumbs-up enters frame. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-09
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-clinica.png`
- **End frame:** `media-src/frames/logo-zoom-clinica.png`
- **Salvar como:** `media-src/films/F1-09.mp4`
- **Prompt:**

```text
Pull back out of the clinic through a circular opening into the flat brand symbol, ending exactly on the provided final frame. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-10
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-zoom-advocacia.png`
- **End frame:** `media-src/films/F1-advocacia.png`
- **Salvar como:** `media-src/films/F1-10.mp4`
- **Prompt:**

```text
Fly through the lower-left circle of the flat graphic into a calm law office with wooden shelves; seamless round match-cut. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-11
- **Modelo:** Seedance 2.5 · **Duração:** 8s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-advocacia.png`
- **Salvar como:** `media-src/films/F1-11.mp4`
- **Prompt:**

```text
A lawyer in her 40s leans back with a relieved smile as her monitor updates on its own with new court decisions; a colleague brings coffee; late-afternoon light. Slow orbit. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-12
- **Modelo:** Seedance 2.5 · **Duração:** 5s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-dados.png`
- **Salvar como:** `media-src/films/F1-12.mp4`
- **Prompt:**

```text
Close-up of the monitor; the dashboard stays sharp and unchanged while a soft screen glow pulses; tiny cursor movement. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-13
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-advocacia.png`
- **End frame:** `media-src/frames/logo-zoom-centelha.png`
- **Salvar como:** `media-src/films/F1-13.mp4`
- **Prompt:**

```text
Pull back out of the office into the flat brand symbol, ending centred on the yellow diamond, exactly on the provided final frame. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-14
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-zoom-centelha.png`
- **End frame:** `media-src/films/F1-roda.png`
- **Salvar como:** `media-src/films/F1-14.mp4`
- **Prompt:**

```text
Push into the yellow diamond of the flat graphic, which becomes the glow of a campfire at night; seamless match-cut. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F1-15
- **Modelo:** Seedance 2.5 · **Duração:** 10s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-roda.png`
- **End frame:** `media-src/frames/logo-full.png`
- **Salvar como:** `media-src/films/F1-15.mp4`
- **Prompt:**

```text
Friends and business owners sit in a circle around a fogo de chão, laughing and talking; one man drinks chimarrão from a gourd; sparks rise. The camera rises slowly above the circle and the scene resolves into the flat brand symbol on deep green, ending exactly on the provided final frame. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

### Trilha

#### F1-som
- **Modelo:** Seed Audio 1.0 · **Salvar como:** `media-src/films/F1-som.mp3`
- **Prompt:**

```text
Warm acoustic Brazilian guitar and soft percussion, optimistic, building gently, 50 seconds, subtle clipper buzz at 0:12, a message ping at 0:17, campfire crackle from 0:40.
```

---

## Filme 2 — "Institucional" · 54s de vídeo

### Imagens

#### F2-amanhecer
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F2-amanhecer.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Dawn over a Brazilian city neighbourhood, a shop owner rolling up a metal shutter, golden light flooding the street.
```

#### F2-padaria
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F2-padaria.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. A baker handing warm bread to a smiling regular customer across a wooden counter, early morning.
```

#### F2-equipe
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F2-equipe.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Southia consulting team of six in a bright studio sitting in a circle around a round table with laptops and notebooks, listening to a small-business owner, warm collaborative atmosphere.
```

#### F2-calma
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F2-calma.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. End of the day in a small Brazilian shop: the owner smiles calmly at a phone showing confirmations, closing up, warm golden light.
```

#### F2-titulo-1
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F2-titulo-1.png`
- **Prompt:**

```text
Cinematic dawn street in a Brazilian neighbourhood with the headline "Todo negócio começa com gente." in a large rounded geometric sans serif, cream colour, centred lower third. Perfectly legible Brazilian Portuguese text, no other text.
```

#### F2-titulo-2
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F2-titulo-2.png`
- **Prompt:**

```text
A bright studio with people sitting in a circle around a round table, and the headline "Pessoas, dados e IA na mesma roda." in a large rounded geometric sans serif, cream colour with the word "roda" in warm yellow #F2C230. Perfectly legible Brazilian Portuguese text, no other text.
```

### Vídeos

#### F2-01
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-amanhecer.png`
- **Salvar como:** `media-src/films/F2-01.mp4`
- **Prompt:**

```text
A shop owner rolls up a metal shutter at dawn; golden light floods the street. Slow crane down. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-02
- **Modelo:** Seedance 2.5 · **Duração:** 5s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-titulo-1.png`
- **Salvar como:** `media-src/films/F2-02.mp4`
- **Prompt:**

```text
The headline stays sharp and unchanged while the dawn light slowly warms the street behind it. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-03
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-padaria.png`
- **Salvar como:** `media-src/films/F2-03.mp4`
- **Prompt:**

```text
A baker hands warm bread to a smiling regular customer across the counter. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-04
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-barbearia.png`
- **Salvar como:** `media-src/films/F2-04.mp4`
- **Prompt:**

```text
The barber greets a client with a handshake and a laugh. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-05
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-clinica.png`
- **Salvar como:** `media-src/films/F2-05.mp4`
- **Prompt:**

```text
The physiotherapist guides a patient's arm movement, both smiling. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-06
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F1-advocacia.png`
- **Salvar como:** `media-src/films/F2-06.mp4`
- **Prompt:**

```text
The lawyer welcomes a family into her office with a warm smile. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-07
- **Modelo:** Seedance 2.5 · **Duração:** 10s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-equipe.png`
- **Salvar como:** `media-src/films/F2-07.mp4`
- **Prompt:**

```text
The team listens to a small-business owner around the round table; a slow 180-degree orbit around the circle. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-08
- **Modelo:** Seedance 2.5 · **Duração:** 5s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-titulo-2.png`
- **Salvar como:** `media-src/films/F2-08.mp4`
- **Prompt:**

```text
The headline stays sharp and unchanged; the people around the table move naturally behind it. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-09
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F2-calma.png`
- **Salvar como:** `media-src/films/F2-09.mp4`
- **Prompt:**

```text
At the end of the day the owner smiles at the phone and closes up the shop; gentle drift. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F2-10
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-full.png`
- **End frame:** `media-src/frames/logo-horizontal.png`
- **Salvar como:** `media-src/films/F2-10.mp4`
- **Prompt:**

```text
The flat brand symbol on deep forest green; the camera slowly pulls back and the composition settles exactly on the provided final frame with the full horizontal logo. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

### Trilha

#### F2-som
- **Modelo:** Seed Audio 1.0 · **Salvar como:** `media-src/films/F2-som.mp3`
- **Prompt:**

```text
Cinematic, warm, hopeful score with piano and strings and a Brazilian acoustic guitar motif, 45 seconds, soft ending.
```

---

## Filme 3 — "Acelere" · 42s de vídeo

### Imagens

#### F3-sufoco
- **Modelo:** Higgsfield Soul 2.0 · **Proporção:** 16:9 · **Qualidade 2K**
- **Salvar como:** `media-src/films/F3-sufoco.png`
- **Prompt:**

```text
Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, letters or emblems, no text, no logos, no watermarks. Night in a small clothing shop, the tired owner scrolling a phone flooded with unanswered messages, spreadsheets on a laptop, cold blue screen light.
```

#### F3-contador
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F3-contador.png`
- **Prompt:**

```text
Photorealistic close-up of a smartphone screen at night showing a red notification counter and the label exactly "47 mensagens sem resposta". Perfectly legible Brazilian Portuguese text, no other text.
```

#### F3-agente
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F3-agente.png`
- **Prompt:**

```text
A laptop screen with a deep green (#1C3322) chat interface where an AI agent answers customer messages, several chat bubbles, and a label reading exactly "Atendimento 24h". Perfectly legible Brazilian Portuguese text, no other text.
```

#### F3-campanhas
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F3-campanhas.png`
- **Prompt:**

```text
A screen with a grid of nine social media ads in green and cream for a clothing shop, and a label reading exactly "Campanhas no automático". Perfectly legible Brazilian Portuguese text, no other text.
```

#### F3-painel
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F3-painel.png`
- **Prompt:**

```text
A clean sales dashboard on a monitor with counters and a rising line chart, the main number highlighted in warm yellow #F2C230, and a title reading exactly "Decisões com dados". Perfectly legible Brazilian Portuguese text, no other text.
```

#### F3-manha
- **Modelo:** GPT Image 2.5 · **Proporção:** 16:9 · **Resolução 2K**
- **Salvar como:** `media-src/films/F3-manha.png`
- **Prompt:**

```text
Next morning in the same small clothing shop, the owner relaxed with a coffee in the sunlight, staff serving customers. A small caption at the bottom reads exactly "Exemplo ilustrativo: +38% vendas · 4h/dia de volta". Perfectly legible Brazilian Portuguese.
```

### Vídeos

#### F3-01
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-sufoco.png`
- **Salvar como:** `media-src/films/F3-01.mp4`
- **Prompt:**

```text
The tired owner scrolls a phone flooded with unanswered messages at night; cold blue screen light. Slow push-in. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-02
- **Modelo:** Seedance 2.5 · **Duração:** 4s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-contador.png`
- **Salvar como:** `media-src/films/F3-02.mp4`
- **Prompt:**

```text
The counter on screen stays sharp and unchanged; the screen glows in the dark. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-03
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-agente.png`
- **Salvar como:** `media-src/films/F3-03.mp4`
- **Prompt:**

```text
Chat bubbles on the screen stay sharp; gentle push-in and soft screen glow, as if replies just arrived. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-04
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-campanhas.png`
- **Salvar como:** `media-src/films/F3-04.mp4`
- **Prompt:**

```text
The ad grid stays sharp and unchanged; slow parallax push-in across the screen. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-05
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-painel.png`
- **Salvar como:** `media-src/films/F3-05.mp4`
- **Prompt:**

```text
The dashboard stays sharp and unchanged; slow push-in toward the highlighted yellow number. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-06
- **Modelo:** Seedance 2.5 · **Duração:** 8s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/films/F3-manha.png`
- **Salvar como:** `media-src/films/F3-06.mp4`
- **Prompt:**

```text
The owner sips coffee and smiles while staff serve customers; morning sun; the caption stays sharp and unchanged. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

#### F3-07
- **Modelo:** Seedance 2.5 · **Duração:** 6s · 16:9 · 720p · áudio desligado
- **Start frame:** `media-src/frames/logo-horizontal.png`
- **End frame:** `media-src/frames/logo-horizontal-cta.png`
- **Salvar como:** `media-src/films/F3-07.mp4`
- **Prompt:**

```text
The flat horizontal brand logo on deep forest green stays perfectly still while the camera slowly pushes in, ending exactly on the provided final frame with the yellow button below. The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; only the camera moves. Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, keep faces consistent, 24fps film look.
```

### Trilha

#### F3-som
- **Modelo:** Seed Audio 1.0 · **Salvar como:** `media-src/films/F3-som.mp3`
- **Prompt:**

```text
Modern upbeat electronic track with a building rhythm, tense start, release at 0:24, confident ending, 45 seconds, light notification pings.
```
