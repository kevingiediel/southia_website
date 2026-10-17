import { defineConfig } from 'vite';
import partials from './vite-plugins/partials.js';

export default defineConfig({
  base: '/',
  plugins: [partials({ dir: 'src/partials', data: 'src/data/site.json' })],
  build: {
    rollupOptions: { input: { main: 'index.html' } },
  },
});
