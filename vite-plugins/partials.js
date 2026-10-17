import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';

// Renders every HTML entry through Handlebars, with src/partials/*.hbs
// registered as partials and site.json (plus `extra`) as context.
export default function partials({ dir, data, extra = {} }) {
  const hbs = Handlebars.create();
  hbs.registerHelper('eq', (a, b) => a === b);

  const files = () => fs.readdirSync(dir).filter((f) => f.endsWith('.hbs'));
  const register = () => {
    for (const f of files()) hbs.registerPartial(path.basename(f, '.hbs'), fs.readFileSync(path.join(dir, f), 'utf8'));
  };
  const context = () => ({ ...JSON.parse(fs.readFileSync(data, 'utf8')), ...extra });

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
