// Soluções cards tilt toward the pointer (desktop pointers only).
const MAX_DEG = 6;

export function init(cards, ctx) {
  if (!ctx.finePointer) return undefined;
  const { gsap } = ctx;
  const offs = [];

  for (const card of cards.querySelectorAll('.card')) {
    gsap.set(card, { transformPerspective: 900 });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 2 * MAX_DEG);
      rx(-py * 2 * MAX_DEG);
    };
    const onLeave = () => { rx(0); ry(0); };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    offs.push(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    });
  }
  return () => offs.forEach((off) => off());
}
