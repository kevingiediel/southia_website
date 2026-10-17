# Builds films/shots.json (the shot list scripts/generate-films.mjs sends to Higgsfield).
# Human-readable version: docs/FILMS.md. Run: python -I films/build-shots.py
import json, os

style = ("Photorealistic cinematic still, warm natural light, contemporary Brazilian small business, real diverse Brazilian people, "
         "wardrobe and props in deep forest green (#1C3322), herb green (#3E6A3B) and sage (#A3C08A) with a single warm yellow (#F2C230) accent, "
         "cream walls, shallow depth of field, soft film grain, authentic friendly mood, 35mm lens, no text, no logos, no watermarks.")
motion = ("Smooth cinematic camera, natural human motion, no cuts, no on-screen text added, no logo changes, "
          "keep faces consistent, 24fps film look.")
LOGO = (" The brand symbol is a flat graphic: it stays perfectly still and unchanged, it never rotates, distorts, glows "
        "or casts shadows; only the camera moves.")
GPT = 'gpt_image_2_5'


def S(id, gate, prompt, model='text2image_soul_v2', text=False):
    return {"id": id, "gate": gate, "kind": "still", "model": model, "text": text, "prompt": prompt}


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
    S("F1-barbearia", 1, "Warm neighbourhood barbershop in Porto Alegre, a barber giving a man a fade haircut, two friends laughing on a green bench, vintage mirrors, plants, afternoon sun."),
    S("F1-chat", 1, "Photorealistic close-up of a smartphone held by a hand in a warm barbershop, shallow depth of field. The screen shows a WhatsApp-style chat titled \"Barbearia do Rafa\" with exactly these messages, in order: customer on the right in a light green bubble \"Oi! Tem horário amanhã às 15h?\"; business on the left in a white bubble \"Tem sim! 15h com o Rafa. Confirmo pra você?\"; customer \"Pode confirmar 👍\"; business \"Prontinho ✅ Te lembro amanhã.\"" + LEGIBLE, GPT, True),
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
    f.write(json.dumps({"style": style, "motion": motion, "shots": shots}, ensure_ascii=False, indent=2) + '\n')
kinds = {k: sum(1 for s in shots if s['kind'] == k) for k in ('still', 'video', 'audio')}
print(len(shots), 'shots;', sum(1 for s in shots if s['gate'] == 1), 'in gate 1;', kinds)
