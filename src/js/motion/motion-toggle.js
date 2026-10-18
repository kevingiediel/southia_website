// "Pausar animações": one control for everything that moves on its own (hero film, ring
// loops, marquee) — WCAG 2.2.2. Modules listen for `southia:motion-pause` and read ctx.motionPaused.
export function init(button, ctx) {
  ctx.motionPaused = false;
  const onClick = () => {
    ctx.motionPaused = !ctx.motionPaused;
    button.setAttribute('aria-pressed', String(ctx.motionPaused));
    document.dispatchEvent(new CustomEvent('southia:motion-pause', { detail: { paused: ctx.motionPaused } }));
  };
  button.addEventListener('click', onClick);
  return () => button.removeEventListener('click', onClick);
}
