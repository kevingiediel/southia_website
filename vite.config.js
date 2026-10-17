import { defineConfig } from 'vite';
import partials from './vite-plugins/partials.js';
import { SITE_URL, WHATSAPP, WHATSAPP_TEXT, whatsappUrl } from './src/js/config.js';

const wa = whatsappUrl(WHATSAPP, WHATSAPP_TEXT);
if (!wa) console.warn('⚠ WhatsApp number is a placeholder — button hidden (set WHATSAPP in src/js/config.js)');

// sitemap.xml is generated so its lastmod is always the build date.
const sitemap = () => ({
  name: 'southia-sitemap',
  apply: 'build',
  generateBundle() {
    const today = new Date().toISOString().slice(0, 10);
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
    });
  },
});

export default defineConfig({
  base: '/',
  plugins: [
    partials({ dir: 'src/partials', data: 'src/data/site.json', extra: { whatsappUrl: wa } }),
    sitemap(),
  ],
  build: {
    rollupOptions: { input: { main: 'index.html', notFound: '404.html' } },
  },
});
