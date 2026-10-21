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

here = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here, 'shots.json'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(json.dumps({"style": style, "motion": motion, "resolution": "720p", "shots": shots}, ensure_ascii=False, indent=2) + '\n')
kinds = {k: sum(1 for s in shots if s['kind'] == k) for k in ('still', 'video', 'audio')}
print(len(shots), 'shots;', sum(1 for s in shots if s['gate'] == 1), 'in gate 1;', kinds)
