# Deploying to Hostinger

The site is fully static. `npm run build` produces `dist/`; its **contents** go into `public_html/` on Hostinger. No Node.js, PHP or database is needed on the server.

## Before the first deploy

1. **WhatsApp number:** edit `src/js/config.js` and replace `TODO_WHATSAPP` with the real number (e.g. `'+55 11 99999-0000'`). Until then the WhatsApp button is hidden and the build prints a warning.
2. **Media:** run `npm run build` and read the check output; it lists any slots still missing video (see `docs/MEDIA.md`). Missing slots show the brand placeholder, so this doesn't block a deploy.
3. **Domain and SSL in hPanel:** point `southia.com.br` at the hosting plan, then **Security → SSL → install the free SSL** for the domain. Once SSL is active, `.htaccess` redirects all traffic to `https://southia.com.br` (http and www both 301 to it).

## Option A — File Manager (simplest)

1. `npm run build`
2. Zip the **contents** of `dist/` (not the folder itself). Make sure the hidden files `.htaccess` and `assets/.htaccess` are included. On Windows, enable "Hidden items" in Explorer before selecting.
3. hPanel → **Files → File Manager → public_html/**. Delete the old site files (keep anything Hostinger created that you still need, e.g. `.well-known/`).
4. Upload the zip, right-click → **Extract** into `public_html/`, then delete the zip.

## Option B — Git deployment

1. `npm run deploy:branch` builds and commits `dist/` to a local `deploy` branch (it never pushes).
2. `git push origin deploy`
3. hPanel → **Advanced → Git**: repository = this GitHub repo, branch = `deploy`, directory = empty (deploys into `public_html/`). Press **Deploy**, or turn on auto-deployment with the webhook Hostinger shows.

Repeat steps 1–2 for each update (and press Deploy if auto-deployment is off).

## After each deploy — checklist

- [ ] `http://southia.com.br` and `https://www.southia.com.br` both end on `https://southia.com.br/`
- [ ] `https://southia.com.br/qualquer-coisa` shows the Southia 404 page
- [ ] Anchor links (Soluções, Como trabalhamos, Fale com a gente) scroll to their sections
- [ ] Videos play on a phone (and the posters show with Low Power Mode on)
- [ ] "Agendar uma conversa" opens an email to ola@southia.com.br; WhatsApp opens a chat (once the number is set)
- [ ] Share preview: paste the URL into the Facebook Sharing Debugger / LinkedIn Post Inspector and confirm the `og-image.jpg` card
- [ ] DevTools → Network: `/assets/*` files return `Cache-Control: public, max-age=31536000, immutable`
