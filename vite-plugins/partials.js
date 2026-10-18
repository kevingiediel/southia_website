import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { mediaExists, mediaAttrs, readyStops, readyVideos } from './media.js';

// Renders every HTML entry through Handlebars, with src/partials/*.hbs
// registered as partials and site.json (plus `extra`) as context. Media lists and
// attributes only include files that exist in `publicDir` (see ./media.js).
export default function partials({ dir, data, publicDir = 'public', extra = {} }) {
  const hbs = Handlebars.create();
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('concat', (...args) => args.slice(0, -1).join(''));
  hbs.registerHelper('mediaAttrs', (base) => new hbs.SafeString(mediaAttrs(base, mediaExists(publicDir))));

  const files = () => fs.readdirSync(dir).filter((f) => f.endsWith('.hbs'));
  const register = () => {
    for (const f of files()) hbs.registerPartial(path.basename(f, '.hbs'), fs.readFileSync(path.join(dir, f), 'utf8'));
  };
  const context = () => {
    const site = JSON.parse(fs.readFileSync(data, 'utf8'));
    const exists = mediaExists(publicDir);
    return {
      ...site,
      film: { ...site.film, stops: readyStops(site.film?.stops ?? [], exists) },
      videos: readyVideos(site.videos ?? [], exists),
      ...extra,
    };
  };

  return {
    name: 'southia-partials',
    buildStart() {
      for (const f of files()) this.addWatchFile(path.join(dir, f));
      this.addWatchFile(data);
    },
    configureServer(server) {
      server.watcher.add([dir, data]);
      server.watcher.on('change', (file) => {
        if (file.startsWith(path.resolve(dir)) || path.resolve(file) === path.resolve(data)) server.ws.send({ type: 'full-reload' });
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        register();
        return hbs.compile(html)(context());
      },
    },
  };
}
