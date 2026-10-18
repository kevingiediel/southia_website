# Writes docs/FILMS-PROMPTS.md from films/shots.json: every shot ready to paste into the
# Higgsfield web app (model, settings, start/end frames, full prompt).
# Run: python -I films/export-prompts.py
import json, os

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
spec = json.load(open(os.path.join(here, 'shots.json'), encoding='utf-8'))
shots = spec['shots']

MODEL = {
    'text2image_soul_v2': 'Higgsfield Soul 2.0',
    'gpt_image_2_5': 'GPT Image 2.5',
    'nano_banana_pro': 'Nano Banana Pro',
    'seedance_2_5': 'Seedance 2.5',
    'seed_audio': 'Seed Audio 1.0',
}
FILMS = {'F1': 'Filme 1 — "A roda" (hero)', 'F2': 'Filme 2 — "Institucional"', 'F3': 'Filme 3 — "Acelere"'}

# Gate 1 status after review (2026-10-17): redo what showed the "RATI" cape, the glow or the smoke.
STATUS = {
    'F1-barbearia': 'REFAZER — capa sem estampa (o "RATI" saiu na capa)',
    'F1-chat': 'PRONTO — já gerado, texto perfeito',
    'F1-01': 'REFAZER — sem fumaça no fundo',
    'F1-02': 'REFAZER — depois do novo F1-barbearia (sem brilho no círculo)',
    'F1-03': 'REFAZER — depois do novo F1-barbearia',
    'F1-04': 'PRONTO — já gerado',
    'F1-05': 'REFAZER — depois do novo F1-barbearia',
}


def file_for(ref):
    kind, name = ref.split(':')
    return f'media-src/frames/{name}.png' if kind == 'frame' else f'media-src/films/{name}.png'


def block(text):
    return f'```text\n{text}\n```'


out = []
out.append('# Prompts dos filmes Southia — para rodar direto no Higgsfield\n')
out.append('Gerado de `films/shots.json` por `films/export-prompts.py`. Não edite à mão: mude `films/build-shots.py` e rode os dois scripts.\n')
out.append('## Como usar\n')
out.append('1. **Gere as imagens de cada filme primeiro.** Elas viram o quadro inicial/final dos vídeos. '
           'Salve cada uma com o nome indicado (ex.: `F1-barbearia.png`) em `media-src/films/`.')
out.append('2. **Vídeos: Seedance 2.5**, modo com quadros (start/end frame), proporção **16:9**, resolução **' + spec.get('resolution', '720p') +
           '**, **áudio desligado**, duração indicada em cada plano. Envie como *Start frame* e *End frame* os arquivos indicados.')
out.append('3. **Quadros do logo** (`media-src/frames/logo-*.png`) são renderizados dos SVGs oficiais do manual. Use exatamente esses arquivos; '
           'nunca gere o logo com IA. Se faltarem, rode `npm run brand:frames`.')
out.append('4. **Trilhas: Seed Audio 1.0.**')
out.append('5. Salve cada vídeo como `media-src/films/<ID>.mp4` (ex.: `F1-03.mp4`) para eu montar os cortes e o site.\n')
out.append(f'Custo estimado (720p): ~7 créditos por segundo de vídeo; imagens 0,12–0,5; trilhas 1,2.\n')

for prefix, title in FILMS.items():
    group = [s for s in shots if s['id'].startswith(prefix)]
    secs = sum(s.get('duration', 0) for s in group if s['kind'] == 'video')
    out.append(f'---\n\n## {title} · {secs}s de vídeo\n')
    for kind, heading in (('still', 'Imagens'), ('video', 'Vídeos'), ('audio', 'Trilha')):
        items = [s for s in group if s['kind'] == kind]
        if not items:
            continue
        out.append(f'### {heading}\n')
        for s in items:
            out.append(f'#### {s["id"]}' + (f' — {STATUS[s["id"]]}' if s['id'] in STATUS else ''))
            model = MODEL.get(s.get('model') or ('seedance_2_5' if kind == 'video' else 'seed_audio'), s.get('model'))
            if kind == 'still':
                quality = 'Qualidade 2K' if s['model'] == 'text2image_soul_v2' else 'Resolução 2K'
                out.append(f'- **Modelo:** {model} · **Proporção:** 16:9 · **{quality}**')
                out.append(f'- **Salvar como:** `media-src/films/{s["id"]}.png`')
                prompt = s['prompt'] if s.get('text') else f'{spec["style"]} {s["prompt"]}'
            elif kind == 'video':
                out.append(f'- **Modelo:** {model} · **Duração:** {s["duration"]}s · 16:9 · {spec.get("resolution", "720p")} · áudio desligado')
                out.append(f'- **Start frame:** `{file_for(s["start"])}`')
                if s.get('end'):
                    out.append(f'- **End frame:** `{file_for(s["end"])}`')
                out.append(f'- **Salvar como:** `media-src/films/{s["id"]}.mp4`')
                prompt = f'{s["prompt"]} {spec["motion"]}'
            else:
                out.append(f'- **Modelo:** {model} · **Salvar como:** `media-src/films/{s["id"]}.mp3`')
                prompt = s['prompt']
            out.append('- **Prompt:**\n')
            out.append(block(prompt) + '\n')

path = os.path.join(root, 'docs', 'FILMS-PROMPTS.md')
with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(out))
print('wrote', os.path.relpath(path, root), len(shots), 'shots')
