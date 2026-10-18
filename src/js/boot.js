// Starts every module whose element exists. One module failing never stops the others;
// a failure in a motion module drops .js-motion so all content stays visible.
// [selector, module, root]: 'self' = the matched element, 'section' = its <section>, 'doc' = document (module handles many).
export function boot(registry, ctx) {
  for (const [selector, mod, scope] of registry) {
    const el = document.querySelector(selector);
    if (!el) continue;
    try {
      const root = scope === 'doc' ? document.documentElement : scope === 'section' ? el.closest('section') : el;
      mod.init(root, ctx);
    } catch (err) {
      console.warn('[motion] disabled:', err);
      document.documentElement.classList.remove('js-motion');
    }
  }
}
