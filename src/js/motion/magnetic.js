// Primary CTAs lean toward the pointer, then spring back (desktop pointers only).
const MAX_PX = 10;

export function init(root, ctx) {
  if (!ctx.finePointer) return undefined;
  const { gsap } = ctx;
  const offs = [];

  for (const btn of root.querySelectorAll('[data-magnetic]')) {
    const x = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const y = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_PX);
      y(((e.clientY - r.top) / r.height - 0.5) * 2 * MAX_PX);
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)', overwrite: true });
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerleave', onLeave);
    offs.push(() => {
      btn.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', onLeave);
    });
  }
  return () => offs.forEach((off) => off());
}
