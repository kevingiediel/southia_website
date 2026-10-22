# Builds films/shots.json (the shot list scripts/generate-films.mjs sends to Higgsfield).
# Human-readable version: docs/FILMS.md. Run: python -I films/build-shots.py
import json, os

style = ("Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, "
         "wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, "
         "cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, plain clothing and fabrics without prints, "
         "letters or emblems, no text, no logos, no watermarks.")
motion = ("Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, "
          "keep faces consistent, 24fps film look.")
LOGO = (" The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows "
        "or casts shadows; no light bloom, no smoke, no haze, no particles; the background stays a clean flat deep green; "
        "only the camera moves.")
GPT = 'gpt_image_2_5'


def S(id, gate, prompt, model='text2image_soul_v2', text=False, image=None):
    shot = {"id": id, "gate": gate, "kind": "still", "model": model, "text": text, "prompt": prompt}
    if image:
        shot["image"] = image
    return shot


def V(id, gate, dur, prompt, start, end=None):
    shot = {"id": id, "gate": gate, "kind": "video", "duration": dur, "start": start, "prompt": prompt}
    if end:
        shot["end"] = end
    return shot


def A(id, gate, prompt):
    return {"id": id, "gate": gate, "kind": "audio", "prompt": prompt}


LEGIBLE = " Perfectly legible Brazilian Portuguese text, no other text."

shots = [
    # ---------------- Film 1 "A roda"
    S("F1-barbearia", 1, "Cozy neighbourhood barbershop in Brazil (Barbearia do Samuel), warm late-afternoon natural light, vintage mirrors, plants, a green waiting bench. Samuel, the barber, is a white Brazilian man in his mid-30s with fair skin, short dark brown hair and a well-groomed beard, wearing a plain dark green shirt; he runs the clippers over a client's hair while they chat. The client, under a plain dark green barber cape with no print, laughs genuinely. On the bench a woman smiles proudly at her husband in the chair and another client waits casually."),
    # Keyframe K4 candidates (validated one by one; main action centred so the hero's circular crop works)
    S("F1-K4a", "kf", "Wide eye-level shot of a cozy neighbourhood barbershop in Brazil, warm late-afternoon natural light through the window, vintage mirrors, plants, a green waiting bench along the wall. Samuel, the barber, is a white Brazilian man in his mid-30s with fair skin, short dark brown hair and a well-groomed beard, wearing a plain dark green shirt; standing behind the barber chair in the centre of the frame, he runs the clippers over a client's hair while they chat. The client, seated under a plain dark green barber cape with no print, laughs genuinely, happy and relaxed. On the waiting bench to the right, a woman smiles proudly at her husband in the chair, and another client waits casually. Main action centred in the frame."),
    # K4 approved (2026-10-19): K4a with the text on the cape removed.
    S("F1-K4", "kf-edit", "Edit this photo: remove the word written on the green barber cape so the cape is plain dark green fabric with no letters, logos or print. Keep everything else exactly identical: same people, faces, expressions, poses, clothing, lighting, colours, background and framing.", 'nano_banana_pro', True, "still:F1-K4a"),
    # Advocacia keyframe K4 candidates: the pain of chasing data across different systems.
    S("F1-ADV-K4a", "kf-adv", "Medium shot of a Brazilian law office, warm late-afternoon light, wooden bookshelves full of case files. Dra. Helena, a Brazilian lawyer in her 40s with shoulder-length dark hair, wearing a plain navy blazer, sits at her desk surrounded by three monitors, each showing a different software system with blurred, unreadable interfaces, plus a laptop and stacks of paper case folders with colourful tabs. She rubs her forehead with one hand, focused and tired, switching between screens. A cup of coffee, sticky notes on the monitor frames. Screens are soft and blurred, no legible text anywhere. Main action centred in the frame."),
    S("F1-ADV-K4b", "kf-adv", "Wide eye-level shot of a busy small Brazilian law office, warm natural light, wooden shelves with case files. In the centre, Dra. Helena, a Brazilian lawyer in her 40s with shoulder-length dark hair, wearing a plain navy blazer, stands between two desks looking from one computer to another, each screen showing a different system with blurred unreadable interfaces; a colleague beside her holds a tablet and a stack of printed documents; piles of folders on the desks and a printer working in the background. Organised chaos, many sources of information. No legible text anywhere. Main action centred in the frame."),
    S("F1-ADV-K4c", "kf-adv2", "Recompose this photo as a new shot of the same scene: the same lawyer (same face, hair, navy blazer), the same law office with wooden bookshelves full of colourful case files, the same warm late-afternoon light and colours. Frontal medium shot from across the desk: her face is exactly in the centre of the frame and fully visible, nothing in front of her. She still rubs her forehead with one hand, focused and tired, looking at the screens. The three monitors showing different software systems are moved to the left and right edges of the frame, angled toward her, with blurred unreadable screens; a laptop in front of her, stacks of colourful case folders and yellow sticky notes on the desk, a cup of coffee. No legible text anywhere. 16:9.", 'nano_banana_pro', True, "still:F1-ADV-K4a"),
    S("F1-ADV-K4d", "kf-adv3", "Edit this photo, keeping the same lawyer (same face, hair, navy blazer), the same office, desk, monitors, laptop, folders, framing and warm light. Change her expression and pose: she is now happy and relieved, smiling warmly, sitting upright with her hands relaxed near the laptop, watching the work happen by itself. Add a magical but realistic visual of automated research: small glowing translucent data icons (document sheets, folders, database cylinders, magnifying glasses, check marks) float out of the monitors and the laptop toward the centre, connected by thin glowing lines that link one screen to another, like automatic connections between systems. The glow is soft sage green and warm yellow (#A3C08A, #F2C230). Icons only, no letters, no numbers, no legible text anywhere.", 'nano_banana_pro', True, "still:F1-ADV-K4c"),
    S("F1-CLI-K4a", "kf-cli", "Wide eye-level shot of a bright, welcoming physical therapy clinic in Brazil, morning natural light, light wooden floor, plants, cream walls, exercise mats and a treatment table. In the centre, Marina, a Brazilian physiotherapist in her early 30s with curly dark hair tied back, wearing a plain sage green polo, and the receptionist beside her, a young Brazilian man in a plain dark green shirt, both laugh happily looking at a tablet she holds, its screen showing a grid of colourful square photo tiles, soft and blurred. In the background, slightly out of focus, a smiling older patient does exercises with a yellow elastic band. Main action centred in the frame."),
    S("F1-CLI-K4b", "kf-cli", "Medium shot of a bright physical therapy clinic in Brazil, morning natural light, plants and wooden wall bars in the background. Centred in the frame, Marina, a Brazilian physiotherapist in her early 30s with curly dark hair tied back, wearing a plain sage green polo, smiles proudly at her smartphone, its screen showing a grid of colourful square photo tiles, soft and blurred; beside her a smiling older patient in plain workout clothes holds a yellow elastic band and gives a thumbs-up. Warm, happy, energetic mood. Faces and phone in the centre third of the frame."),
    S("F1-CLI-K4c", "kf-cli2", "Edit this photo, keeping the same two people (same faces, hair, expressions and plain green polos), the same older patient exercising with the yellow elastic band in the background, the same bright clinic, plants, light and colours. Changes: remove the small logo on the woman's polo so it is plain fabric with no emblem; remove the yellow foam object from the green table so the table is clear; the man now holds the tablet in the exact centre of the frame, between the two of them, and both lean in and laugh looking at it; its screen shows a grid of colourful square photo tiles. Add a magical but realistic visual of automated social media posting: small glowing translucent square photo tiles, heart icons, calendar icons, clock icons and check marks float up out of the tablet and drift toward the edges of the frame, connected by thin glowing lines, like posts being published automatically. The glow is soft sage green and warm yellow (#A3C08A, #F2C230). Icons only, no letters, no numbers, no legible text anywhere.", 'nano_banana_pro', True, "still:F1-CLI-K4a"),
    S("F1-CLI-K4d", "kf-cli3", "Edit this photo: the woman's green polo shirt has a small faint curved logo on the chest, to the right of the buttons; remove it completely so the polo is plain green fabric with no emblem, mark or stitching. Keep everything else exactly identical: same people, faces, expressions, poses, tablet, floating glowing icons and lines, clinic, lighting, colours and framing.", 'nano_banana_pro', True, "still:F1-CLI-K4c"),
    S("F1-RODA-K4a", "kf-roda", "Eye-level wide shot at dusk in the Rio Grande do Sul countryside, the sky deep blue with the last warm light on the horizon. Seven people sit on low wooden stools and logs in a circle around a fogo de chão, a small campfire on the ground in the centre of the frame, its flames bright warm yellow. They laugh and talk like old friends: a white Brazilian barber in his mid-30s with a well-groomed beard and a plain dark green shirt, a Brazilian lawyer in her 40s with shoulder-length dark hair and a plain navy jacket, a Brazilian physiotherapist in her early 30s with curly dark hair tied back in a plain sage green sweater, and four other small business owners of different ages. In the foreground, an older gaúcho man in a plain wool poncho sips chimarrão from a cuia with a metal bomba, smiling. Warm firelight on the faces, a few sparks rising. Fire and the circle of people centred in the frame."),
    S("F1-RODA-K4b", "kf-roda", "Top-down aerial shot from directly above, at dusk in the Rio Grande do Sul countryside: a small fogo de chão campfire glows bright warm yellow exactly in the centre of the frame, and seven people sit in a perfect evenly spaced circle around it on low wooden stools, seen from above, looking at each other and laughing; one of them holds a chimarrão cuia. Short dry grass around them, the ground darkening to deep green toward the edges of the frame, warm firelight on heads and shoulders, a few sparks rising toward the camera. Symmetrical, graphic composition, like a clock face with the fire at its centre."),
    S("F1-RODA-K4c", "kf-roda2", "Recompose this photo as a new shot with the same mood, light and colours: a top-down aerial view from directly above, at dusk on an open pampa grass field in the Rio Grande do Sul countryside, no walls, no buildings, no structures anywhere. A small fogo de chão campfire of crossed logs glows bright warm yellow exactly in the centre of the frame. Seven people sit in an evenly spaced circle around it on low wooden stools, every person fully inside the frame, seen whole from above with heads, shoulders and knees visible, laughing and talking to each other; everyday casual clothes in varied muted colours (wool sweaters, denim jackets, a plain cream wool poncho), no uniforms. One older gaúcho man passes a traditional chimarrão cuia, a round dark gourd with a metal bomba straw, to the person beside him. Warm firelight on heads and shoulders, a few sparks rising toward the camera, the grass fading to deep green toward the edges of the frame. Symmetrical, like a clock face with the fire at its centre. No text anywhere. 16:9.", 'nano_banana_pro', True, "still:F1-RODA-K4a"),
    S("F1-RODA-K4d", "kf-roda2", "Photorealistic cinematic still, top-down aerial view from directly above at dusk on an open pampa grass field in the Rio Grande do Sul countryside, no walls, no buildings. A small fogo de chão campfire of crossed logs glows bright warm yellow (#F2C230) exactly in the centre of the frame. Seven Brazilian people of different ages sit in an evenly spaced circle around it on low wooden stools, every person fully inside the frame, seen whole from above, laughing and talking to each other; everyday casual clothes in varied muted colours (wool sweaters, denim jackets, a plain cream wool poncho), plain fabrics without prints or letters. One older gaúcho man passes a traditional chimarrão cuia, a round dark gourd with a metal bomba straw, to the woman beside him. Warm firelight on heads and shoulders, a few sparks rising, the grass fading to deep forest green (#1C3322) toward the edges. Symmetrical composition, like a clock face with the fire at its centre, soft film grain. No text, no logos, no watermarks.", GPT, True),
    S("F1-RODA-K4e", "kf-roda3", "Edit this photo to make it much brighter: earlier golden-hour dusk, the sun just setting, soft warm natural daylight still filling the whole pampa field so the grass is a lively green and every person's face, hair and clothes are clearly lit and easy to read; the campfire still glows bright warm yellow in the centre. Keep everything else exactly identical: same seven people, same faces, poses, clothes and stools, the chimarrão cuia being passed, the fire, the top-down camera and the framing. No text anywhere.", 'nano_banana_pro', True, "still:F1-RODA-K4d"),
    S("F1-K4b", "kf","Medium shot, slightly low angle, inside a cozy neighbourhood barbershop in Brazil, warm late-afternoon light. Samuel, the barber, is a white Brazilian man in his mid-30s with fair skin, short dark brown hair and a well-groomed beard, wearing a plain dark green shirt; centred in the frame, he runs the clippers over a client's hair and both are laughing. The client wears a plain dark green barber cape with no print. Behind them, slightly out of focus on a green bench, a woman smiles proudly at her husband and another client waits. Vintage mirror and plants in the background. Faces and clippers in the centre third of the frame."),
    S("F1-chat", 1, "Photorealistic close-up of a smartphone held by a hand in a warm barbershop, shallow depth of field. The screen shows a WhatsApp-style chat titled \"Barbearia do Samuel\" with exactly these messages, in order: customer on the left in a white bubble \"Oi, tem horário amanhã às 15h para barba?\"; business on the right in a light green bubble \"Tem sim! 15h com o Samuel. Confirmo pra você?\"; customer \"Pode confirmar\"; business \"Prontinho, te lembro amanhã.\" No emojis." + LEGIBLE, GPT, True),
    V("F1-01", 1, 4, "Very slow push-in on a flat brand symbol on a deep forest green background toward its top circle." + LOGO, "frame:logo-full", "frame:logo-zoom-barbearia"),
    V("F1-02", 1, 4, "The camera flies through the round circle of the flat graphic and lands inside a warm neighbourhood barbershop; seamless match-cut transition through the round shape.", "frame:logo-zoom-barbearia", "still:F1-barbearia"),
    V("F1-03", 1, 8, "A barber gives a man a fade haircut, friends laugh on the waiting bench, warm afternoon light through the window, relaxed joyful mood. Slow dolly left.", "still:F1-barbearia"),
    V("F1-04", 1, 5, "Close-up of a phone in a customer's hand; the chat on screen stays sharp, unchanged and readable; gentle handheld drift; the barbershop blurred behind.", "still:F1-chat"),
    V("F1-05", 1, 4, "The camera pulls back out of the barbershop through a circular opening and lands on the flat brand symbol, ending exactly on the provided final frame." + LOGO, "still:F1-barbearia", "frame:logo-zoom-barbearia"),

    S("F1-clinica", 2, "Bright physical therapy clinic with wooden floor and plants, a physiotherapist and a receptionist smiling at a tablet, a patient doing elastic band exercises in the background."),
    S("F1-instagram", 2, "Photorealistic over-the-shoulder close-up of a tablet in a bright physiotherapy clinic. The screen shows an Instagram profile grid for \"Clínica Movimento\" with nine cohesive green-and-cream posts about posture and exercise, and a floating card that reads exactly \"Campanha criada automaticamente\"." + LEGIBLE, GPT, True),
    V("F1-06", 2, 4, "Fly through the right circle of the flat graphic into a bright physical therapy clinic; seamless round match-cut.", "frame:logo-zoom-clinica", "still:F1-clinica"),
    V("F1-07", 2, 8, "In a bright physical therapy clinic, a physiotherapist and the receptionist smile at a tablet showing their new Instagram posts; a patient exercises with an elastic band in the background. Slow push-in.", "still:F1-clinica"),
    V("F1-08", 2, 5, "Over-the-shoulder close-up of the tablet; the Instagram grid and the card stay sharp and unchanged; the physiotherapist's thumbs-up enters frame.", "still:F1-instagram"),
    V("F1-09", 2, 4, "Pull back out of the clinic through a circular opening into the flat brand symbol, ending exactly on the provided final frame." + LOGO, "still:F1-clinica", "frame:logo-zoom-clinica"),

    S("F1-advocacia", 2, "Calm law office with wooden bookshelves, a Brazilian lawyer in her 40s leaning back with a relieved smile in front of a monitor, a colleague bringing coffee, golden late-afternoon light."),
    S("F1-dados", 2, "Photorealistic close-up of a computer monitor in a law office. The screen shows a clean dashboard titled \"Jurisprudência\" with source cards \"Diário Oficial\", \"STJ\" and \"TJSP\" and a list of new decisions with green check marks and the label \"Atualizado agora\". Deep green and cream interface." + LEGIBLE, GPT, True),
    V("F1-10", 2, 4, "Fly through the lower-left circle of the flat graphic into a calm law office with wooden shelves; seamless round match-cut.", "frame:logo-zoom-advocacia", "still:F1-advocacia"),
    V("F1-11", 2, 8, "A lawyer in her 40s leans back with a relieved smile as her monitor updates on its own with new court decisions; a colleague brings coffee; late-afternoon light. Slow orbit.", "still:F1-advocacia"),
    V("F1-12", 2, 5, "Close-up of the monitor; the dashboard stays sharp and unchanged while a soft screen glow pulses; tiny cursor movement.", "still:F1-dados"),
    V("F1-13", 2, 4, "Pull back out of the office into the flat brand symbol, ending centred on the yellow diamond, exactly on the provided final frame." + LOGO, "still:F1-advocacia", "frame:logo-zoom-centelha"),

    S("F1-roda", 2, "Night in the Rio Grande do Sul countryside, eight people sitting in a circle around a fogo de chão campfire, laughing and talking, one man drinking chimarrão from a cuia with a bomba, warm firelight on faces, sparks rising, starry sky."),
    V("F1-14", 2, 4, "Push into the yellow diamond of the flat graphic, which becomes the glow of a campfire at night; seamless match-cut.", "frame:logo-zoom-centelha", "still:F1-roda"),
    V("F1-15", 2, 10, "Friends and business owners sit in a circle around a fogo de chão, laughing and talking; one man drinks chimarrão from a gourd; sparks rise. The camera rises slowly above the circle and the scene resolves into the flat brand symbol on deep green, ending exactly on the provided final frame." + LOGO, "still:F1-roda", "frame:logo-full"),
    A("F1-som", 2, "Warm acoustic Brazilian guitar and soft percussion, optimistic, building gently, 50 seconds, subtle clipper buzz at 0:12, a message ping at 0:17, campfire crackle from 0:40."),

    # ---------------- Film 2 "Institucional"
    S("F2-amanhecer", 2, "Dawn over a Brazilian city neighbourhood, a shop owner rolling up a metal shutter, golden light flooding the street."),
    S("F2-padaria", 2, "A baker handing warm bread to a smiling regular customer across a wooden counter, early morning."),
    S("F2-equipe", 2, "Southia consulting team of six in a bright studio sitting in a circle around a round table with laptops and notebooks, listening to a small-business owner, warm collaborative atmosphere."),
    S("F2-calma", 2, "End of the day in a small Brazilian shop: the owner smiles calmly at a phone showing confirmations, closing up, warm golden light."),
    S("F2-titulo-1", 2, "Cinematic dawn street in a Brazilian neighbourhood with the headline \"Todo negócio começa com gente.\" in a large rounded geometric sans serif, cream colour, centred lower third." + LEGIBLE, GPT, True),
    S("F2-titulo-2", 2, "A bright studio with people sitting in a circle around a round table, and the headline \"Pessoas, dados e IA na mesma roda.\" in a large rounded geometric sans serif, cream colour with the word \"roda\" in warm yellow #F2C230." + LEGIBLE, GPT, True),
    V("F2-01", 2, 6, "A shop owner rolls up a metal shutter at dawn; golden light floods the street. Slow crane down.", "still:F2-amanhecer"),
    V("F2-02", 2, 5, "The headline stays sharp and unchanged while the dawn light slowly warms the street behind it.", "still:F2-titulo-1"),
    V("F2-03", 2, 4, "A baker hands warm bread to a smiling regular customer across the counter.", "still:F2-padaria"),
    V("F2-04", 2, 4, "The barber greets a client with a handshake and a laugh.", "still:F1-barbearia"),
    V("F2-05", 2, 4, "The physiotherapist guides a patient's arm movement, both smiling.", "still:F1-clinica"),
    V("F2-06", 2, 4, "The lawyer welcomes a family into her office with a warm smile.", "still:F1-advocacia"),
    V("F2-07", 2, 10, "The team listens to a small-business owner around the round table; a slow 180-degree orbit around the circle.", "still:F2-equipe"),
    V("F2-08", 2, 5, "The headline stays sharp and unchanged; the people around the table move naturally behind it.", "still:F2-titulo-2"),
    V("F2-09", 2, 6, "At the end of the day the owner smiles at the phone and closes up the shop; gentle drift.", "still:F2-calma"),
    V("F2-10", 2, 6, "The flat brand symbol on deep forest green; the camera slowly pulls back and the composition settles exactly on the provided final frame with the full horizontal logo." + LOGO, "frame:logo-full", "frame:logo-horizontal"),
    A("F2-som", 2, "Cinematic, warm, hopeful score with piano and strings and a Brazilian acoustic guitar motif, 45 seconds, soft ending."),

    # ---------------- Film 3 "Acelere"
    S("F3-sufoco", 2, "Night in a small clothing shop, the tired owner scrolling a phone flooded with unanswered messages, spreadsheets on a laptop, cold blue screen light."),
    S("F3-contador", 2, "Photorealistic close-up of a smartphone screen at night showing a red notification counter and the label exactly \"47 mensagens sem resposta\"." + LEGIBLE, GPT, True),
    S("F3-agente", 2, "A laptop screen with a deep green (#1C3322) chat interface where an AI agent answers customer messages, several chat bubbles, and a label reading exactly \"Atendimento 24h\"." + LEGIBLE, GPT, True),
    S("F3-campanhas", 2, "A screen with a grid of nine social media ads in green and cream for a clothing shop, and a label reading exactly \"Campanhas no automático\"." + LEGIBLE, GPT, True),
    S("F3-painel", 2, "A clean sales dashboard on a monitor with counters and a rising line chart, the main number highlighted in warm yellow #F2C230, and a title reading exactly \"Decisões com dados\"." + LEGIBLE, GPT, True),
    S("F3-manha", 2, "Next morning in the same small clothing shop, the owner relaxed with a coffee in the sunlight, staff serving customers. A small caption at the bottom reads exactly \"Exemplo ilustrativo: +38% vendas · 4h/dia de volta\". Perfectly legible Brazilian Portuguese.", GPT, True),
    V("F3-01", 2, 6, "The tired owner scrolls a phone flooded with unanswered messages at night; cold blue screen light. Slow push-in.", "still:F3-sufoco"),
    V("F3-02", 2, 4, "The counter on screen stays sharp and unchanged; the screen glows in the dark.", "still:F3-contador"),
    V("F3-03", 2, 6, "Chat bubbles on the screen stay sharp; gentle push-in and soft screen glow, as if replies just arrived.", "still:F3-agente"),
    V("F3-04", 2, 6, "The ad grid stays sharp and unchanged; slow parallax push-in across the screen.", "still:F3-campanhas"),
    V("F3-05", 2, 6, "The dashboard stays sharp and unchanged; slow push-in toward the highlighted yellow number.", "still:F3-painel"),
    V("F3-06", 2, 8, "The owner sips coffee and smiles while staff serve customers; morning sun; the caption stays sharp and unchanged.", "still:F3-manha"),
    V("F3-07", 2, 6, "The flat horizontal brand logo on deep forest green stays perfectly still while the camera slowly pushes in, ending exactly on the provided final frame with the yellow button below." + LOGO, "frame:logo-horizontal", "frame:logo-horizontal-cta"),
    A("F3-som", 2, "Modern upbeat electronic track with a building rhythm, tense start, release at 0:24, confident ending, 45 seconds, light notification pings."),
]


# ---------------- Film 1 clips between the approved keyframes (films/keyframes/*/frames.json).
# Per stop: "in" flies from K3 (window in the symbol) to K4; "live" animates K4 while the bubbles are composited in code.
# The way out reuses "in" played backwards, and K1/K2/K7/K8 are rendered from the official SVG, so AI never draws the logo.
WINDOW_IN = ("The camera flies straight forward through the opening in the flat brand symbol: the sage ring slides past the edges "
             "of the frame and the scene inside grows to fill the whole frame, ending exactly on the provided final frame." + LOGO)
STOPS = [
    ("BAR", "F1", "Samuel keeps running the clippers over the client's hair; the client laughs, the wife on the bench smiles proudly, "
                  "the other client chats. Natural barbershop movement, very slow push-in."),
    ("CLI", "F1-clinica", "The physiotherapist and the receptionist laugh looking at the tablet while the glowing post, heart, calendar and "
                          "clock icons float up out of it and drift slowly outward along the glowing lines; the patient keeps exercising "
                          "with the yellow band. Very slow push-in."),
    ("ADV", "F1-advocacia", "The lawyer smiles, relieved, and leans back a little while the glowing data icons drift slowly out of the "
                            "monitors toward the centre and the lines between them pulse softly. Very slow push-in."),
    ("RODA", "F1-roda", "Top-down view: the old gaúcho passes the chimarrão cuia to the woman beside him, the friends laugh and "
                        "talk, the flames flicker and a few sparks rise. The camera rises very slowly straight up, keeping the fire centred."),
]
for code, kf, live in STOPS:
    into = (WINDOW_IN if code != "RODA" else
            "The camera dives straight into the yellow diamond of the flat brand symbol, which opens onto the campfire seen from "
            "directly above; the scene grows to fill the whole frame, ending exactly on the provided final frame." + LOGO)
    shots.append(V(f"F1-{code}-in", "kf-vid", 4, into, f"kf:{kf}/K3", f"kf:{kf}/K4"))
    shots.append(V(f"F1-{code}-live", "kf-vid", 8, live, f"kf:{kf}/K4"))


# ---------------- "Gente de verdade" marquee: portrait stills (3:4) in the film's style.
# row-1/3/5/8 are crops of the approved keyframes; these four are new, centred faces for the pill/rounded crops.
ROWS = [
    ("row-2", "A young Brazilian man with a freshly trimmed beard sits on the green waiting bench of a cozy neighbourhood barbershop, "
              "warm late-afternoon light, smiling at his smartphone as if he just got a friendly reply; plants and a vintage mirror behind him, softly blurred."),
    ("row-4", "An older Brazilian woman with short grey hair, wearing a plain coral t-shirt, sits on an exercise mat in a bright physical therapy "
              "clinic after her session, a yellow elastic band on her lap, smiling warmly at her smartphone; plants and wooden wall bars softly blurred behind her."),
    ("row-6", "A Brazilian woman in her 50s who owns a small clothing shop stands behind the wooden counter, relaxed and smiling, handing a paper "
              "bag to a customer; shelves of folded clothes and plants behind her, warm natural light."),
    ("row-7", "A small Brazilian team of four in a cozy office celebrates together around a laptop, laughing, two of them doing a high-five; "
              "warm natural window light, plants, cream walls."),
]
for rid, prompt in ROWS:
    shot = S(rid, "rows", prompt + " Vertical portrait framing, faces in the centre of the frame.")
    shot["aspect"] = "3:4"
    shots.append(shot)

KEEP = " Keep everything else exactly identical: same people, faces, expressions, poses, clothes, light, colours and framing. No text anywhere."
for rid, fix in [
    ("row-4", "Edit this photo: remove the yellow foam object from the woman's lap and the green cushion under it, so she simply sits on the exercise mat holding her phone; remove the two standing people whose heads are cut off at the top, replacing them with the softly blurred clinic wall, wooden wall bars and plants."),
    ("row-6", "Edit this photo: remove the small print on the green t-shirt hanging on the wall behind the woman, so it is plain fabric."),
    ("row-7", "Edit this photo: remove the white letters printed on the two dark green sweatshirts, so they are plain fabric with no text, logo or emblem."),
]:
    shot = S(rid + "b", "rows-fix", fix + KEEP, 'nano_banana_pro', True, "still:" + rid)
    shot["aspect"] = "3:4"
    shots.append(shot)

# The hero's closing scene is a tall diamond (the spark, ~0.59:1): a vertical, wider view keeps the whole circle inside it.
_roda_tall = S("F1-RODA-tall", "roda-tall", "Recompose this photo as a tall vertical 9:16 frame of the same scene from the same top-down drone view, with the camera "
              "much higher: the same seven people, clothes, stools, chimarrão cuia being passed and the campfire, but the whole circle of people is small, "
              "exactly in the centre of the frame, its diameter only about half of the frame width, with plenty of the same golden-hour pampa grass all around it "
              "above, below and on both sides. Same warm light and colours. No text anywhere.", 'nano_banana_pro', True, "still:F1-RODA-K4e")
_roda_tall["aspect"] = "9:16"
shots.append(_roda_tall)

# Even wider: in the spark the circle must fit with room to spare, so the clip can open out further.
_roda_wide = S("F1-RODA-wide", "roda-wide", "Recompose this photo as the same tall vertical 9:16 top-down drone view with the camera even higher: "
              "the same seven people, clothes, stools, chimarrão cuia and campfire, but the whole circle of people is much smaller, exactly in the "
              "centre of the frame, its diameter only about 40% of the frame width, every person complete with clear grass around them, and wide "
              "golden-hour pampa grass all around filling the rest of the frame. Same warm light and colours. No text anywhere.",
              'nano_banana_pro', True, "still:F1-RODA-tall")
_roda_wide["aspect"] = "9:16"
shots.append(_roda_wide)

# ---------------- "Seis formas" cards: 3:2 stills cropped to 16:10, one real-life effect per solution (screens blurred, no text).
PRODS = [
    ("prod-1", "Night, a cozy living room lit by a warm lamp: a young Brazilian woman relaxing on the sofa smiles at her smartphone, as if a shop that "
               "already closed just answered her message; soft blurred phone screen, plants and a knitted blanket."),
    ("prod-2", "Inside a small Brazilian flower shop with buckets of colourful flowers, the owner, a woman in her 40s in a plain apron, looks delighted at "
               "her open laptop on the wooden counter, its screen showing a soft, blurred grid of colourful square photos; warm daylight."),
    ("prod-3", "A small Brazilian e-commerce stockroom with shelves of boxes: a calm young employee packs an order into a kraft box, smiling, a tablet "
               "standing beside him with a soft, blurred screen; natural window light, tidy and unhurried."),
    ("prod-4", "Inside a small neighbourhood shop in Brazil, two staff members in plain green shirts serve customers face to face across a clean wooden "
               "counter, everyone laughing; no paperwork anywhere, warm natural light, plants."),
    ("prod-5", "Two Brazilian business partners, a man and a woman in their 30s, sit at a café table by the window looking together at a laptop showing "
               "a soft, blurred simple chart, one pointing at it, both confident and decided; coffee cups, warm afternoon light."),
    ("prod-6", "At the bright reception of a small clinic in Brazil, a friendly receptionist in a plain sage green top holds a tablet with a soft, blurred "
               "screen and explains it to an older patient, who nods with a calm, trusting smile; plants, cream walls."),
]
for pid, prompt in PRODS:
    shot = S(pid, "prods", prompt + " Faces and main action in the centre of the frame.")
    shot["aspect"] = "3:2"  # Soul has no 16:10; cropped to 800×500 afterwards
    shots.append(shot)

# Second take on GPT Image (better at "no text, no logos"): everyday clothes in varied colours, the brand palette only as accents.
CARD_STYLE = ("Photorealistic candid photograph, warm natural light, shallow depth of field, soft film grain, 35mm lens, real Brazilian people, "
              "authentic and friendly mood. Everyday casual clothes in varied natural colours, plain fabrics with no prints, letters, logos or emblems. "
              "Deep green and warm yellow appear only as small accents (a plant, a mug, a cushion). Every screen is softly blurred and unreadable. "
              "No text, no letters, no numbers, no logos, no brand marks, no watermarks anywhere in the image. ")
CARDS = [
    ("prod-1g", "Night in a cozy living room lit by a single warm lamp: one young Brazilian woman alone, curled up on the sofa under a knitted blanket, "
                "smiles at her smartphone as if a shop that already closed has just answered her message."),
    ("prod-2g", "Inside a small Brazilian flower shop full of colourful bouquets: the owner, a woman in her 40s in a plain linen apron, stands alone behind "
                "the wooden counter and looks delighted at her open laptop, its blurred screen showing a grid of colourful square photos. Nobody in front of her."),
    ("prod-3g", "A tidy small e-commerce stockroom with shelves of plain kraft boxes: one calm young Brazilian man in a plain grey t-shirt packs an order "
                "into a kraft box, smiling; a tablet stands on the table beside him with a blurred screen. Natural window light."),
    ("prod-4g", "A small neighbourhood shop in Brazil: two staff members in plain everyday shirts serve two customers face to face across a clean "
                "wooden counter, everyone laughing; no paperwork anywhere, plants, warm natural light."),
    ("prod-5g", "Two Brazilian business partners, a man and a woman in their 30s, sit at a café table by the window looking together at a plain silver "
                "laptop with no logo, its blurred screen showing a simple rising chart; she points at it, both confident and decided; coffee cups, warm afternoon light."),
    ("prod-6g", "The bright reception of a small clinic in Brazil: a friendly receptionist in a plain light top holds a tablet with a blurred screen and "
                "explains it to an older man sitting across the desk, who nods with a calm, trusting smile; plants, cream walls, no signs."),
]
for pid, prompt in CARDS:
    shot = S(pid, "prods2", CARD_STYLE + prompt + " Faces and main action in the centre of the frame. Horizontal 3:2 frame.", GPT, True)
    shot["aspect"] = "3:2"
    shots.append(shot)

_p5 = S("prod-5h", "prods-fix", "Edit this photo: remove the small chart icon printed on the outside of the laptop lid, so the lid is plain smooth silver aluminium with no mark. "
        "Keep everything else exactly identical: same two people, faces, expressions, pose, hand, clothes, cups, café, light, colours and framing. No text anywhere.",
        'nano_banana_pro', True, "still:prod-5g")
_p5["aspect"] = "3:2"
shots.append(_p5)

# Third take: each card shows its solution at work, in the film's language (real people + floating glowing
# interface shapes, like the clinic and law-office keyframes) and in the brand palette.
BRAND_CARD = ("Photorealistic cinematic photograph, warm natural light, shallow depth of field, soft film grain, real Brazilian people. "
              "Brand palette throughout the set: deep forest green (#1C3322) and herb green (#3E6A3B) walls and furniture, cream (#F3EEE2) surfaces, "
              "sage green (#A3C08A) details and a single warm yellow (#F2C230) accent. Plain clothes in those greens and cream, no prints. "
              "Floating translucent glowing interface shapes in sage green and warm yellow illustrate the idea: only shapes and simple icons, "
              "no letters, no numbers, no words, no logos, no brand marks anywhere. Every screen is softly blurred. ")
CARDS3 = [
    ("prod-1v", "Agentes de atendimento: at night in a small shop that already closed, the owner turns off the lights and smiles, while on the counter "
                "a smartphone keeps answering customers by itself: glowing chat bubbles float up from it in pairs (question and answer), with a small "
                "moon and a clock icon, one bubble turning into a small person icon as it is handed to a human."),
    ("prod-2v", "Criativos e campanhas: a small clothing shop owner smiles at her laptop while glowing square social media post cards in the brand "
                "colours fly out of the screen and arrange themselves into a neat grid, small heart icons and rising arrow shapes around them."),
    ("prod-3v", "Integração de sistemas: at a shop counter, a laptop, a tablet, a smartphone and a card machine are connected by thin glowing lines, "
                "small glowing data cards travelling along them from one device to another; a calm employee watches, relaxed."),
    ("prod-4v", "Automação de processos: on a desk, a messy pile of paper invoices and receipts lifts off and turns into a clean flow of glowing nodes "
                "connected by arrows, ending in check marks; in the background, softly out of focus, the team chats and laughs with customers."),
    ("prod-5v", "Engenharia de dados e IA: a business owner at her desk looks confidently at floating translucent dashboard panels with clean bar "
                "and line charts and a donut chart, a small yellow spark icon at the centre where the lines converge; calm, clear, decided."),
    ("prod-6v", "Governança e LGPD: at a clinic reception, a receptionist shows a patient the tablet; above it float a glowing shield with a lock "
                "and a check mark, and small protected data cards inside a soft bubble; the patient nods with a calm, trusting smile."),
]
for pid, prompt in CARDS3:
    shot = S(pid, "prods3", BRAND_CARD + prompt + " Faces and main action in the centre of the frame. Horizontal 3:2 frame.", GPT, True)
    shot["aspect"] = "3:2"
    shots.append(shot)

# "A IA no centro, as pessoas em volta": the section's title, literally, in the cards' visual language (4:5 slot).
_como = S("como-foto", "como", BRAND_CARD + "Seen from slightly above: five Brazilian people of different ages, a small business owner and four consultants, "
          "sit around a round wooden table in a warm studio with deep green walls and plants, talking and laughing, notebooks and coffee cups on the table. "
          "At the exact centre of the table glows a soft warm yellow light, like a small spark, and from it rise a few translucent sage and yellow interface "
          "shapes (a chat bubble, a small chart, connected nodes) that gently circle above the table; the people around it lean in together, clearly in charge. "
          "The circle of people and the glowing centre fill the middle of the frame. Vertical 4:5 frame.", GPT, True)
_como["aspect"] = "4:5"
shots.append(_como)

here = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here, 'shots.json'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(json.dumps({"style": style, "motion": motion, "resolution": "720p", "shots": shots}, ensure_ascii=False, indent=2) + '\n')
kinds = {k: sum(1 for s in shots if s['kind'] == k) for k in ('still', 'video', 'audio')}
print(len(shots), 'shots;', sum(1 for s in shots if s['gate'] == 1), 'in gate 1;', kinds)
