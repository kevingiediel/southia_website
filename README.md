# Southia — site

Site institucional da Southia (**southia.com.br**): página única, estática, em pt-BR, com animações em GSAP e vídeos gerados no Higgsfield. Publicado no Hostinger (pasta `public_html/`).

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências (Node 20+) |
| `npm run dev` | Servidor local em http://localhost:5173 |
| `npm run build` | Gera `dist/` e roda as verificações (links, mídia, HTML, orçamento de JS) |
| `npm run preview` | Serve `dist/` em http://localhost:4173 |
| `npm test` | Testes de navegador (Playwright) |
| `npm run test:unit` | Testes unitários (scripts de mídia, filmes, configuração) |
| `npm run media` | Converte vídeos de `media-src/` para o site (`public/media/`) |
| `npm run deploy:branch` | Gera o build e grava `dist/` no branch `deploy` (não faz push) |
| `npm run brand:frames` | Renderiza os quadros oficiais do logo usados nos filmes |
| `npm run films:prompts` | Regenera `films/shots.json` e `docs/FILMS-PROMPTS.md` |

## Onde mudar o quê

- **Textos e listas** (soluções, passos, marquee, chat do hero, filmes): `src/data/site.json`
- **Estrutura das seções**: `src/partials/*.hbs` (montadas em `index.html` no build)
- **Cores, fontes, espaçamentos**: `src/styles/tokens.css`; estilos por seção em `src/styles/sections/`
- **Animações**: `src/js/motion/` (uma por arquivo); carregadas depois da primeira pintura por `src/js/motion-boot.js`
- **WhatsApp**: `src/js/config.js` → `WHATSAPP` (enquanto for o placeholder, o botão não aparece)

## Marca

Os logos em `src/assets/brand/` foram extraídos como vetores exatos do manual (`marca.pdf`) — **não redesenhe**. O manual pede: o símbolo não gira, não recebe sombras/efeitos, e o lugar aberto fica sempre na base.

## Mídia e filmes

- Vídeos curtos dos espaços do site e das paradas do hero: [`docs/MEDIA.md`](docs/MEDIA.md)
- Filmes (roteiro e prompts do Higgsfield): [`docs/FILMS.md`](docs/FILMS.md), [`docs/FILMS-PROMPTS.md`](docs/FILMS-PROMPTS.md)
- A seção **"Veja a Southia"** aparece sozinha quando existir `public/media/films/film-N.jpg` (+ `.mp4`).

## Publicar

Passo a passo para o Hostinger (Gerenciador de Arquivos ou Git), SSL e checklist: [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Qualidade

Lighthouse mobile (simulado): Performance 98, Acessibilidade 100, Boas práticas 100, SEO 100. Sem JavaScript o conteúdo aparece inteiro; com "reduzir movimento" ligado, não há animações nem vídeos automáticos.
