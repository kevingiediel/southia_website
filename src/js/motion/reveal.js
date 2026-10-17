// Staggered fade-up for [data-reveal]; the hidden start state lives in CSS under .js-motion.
export function init(root, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const els = gsap.utils.toArray(root.querySelectorAll('[data-reveal]'));
  const triggers = ScrollTrigger.batch(els, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8 / ctx.speed, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  });
  return () => triggers.forEach((t) => t.kill());
}
