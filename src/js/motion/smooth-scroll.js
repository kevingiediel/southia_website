import Lenis from 'lenis';

// Lenis smooth scroll, synced with ScrollTrigger; anchor links glide with a header offset.
export function init(root, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const lenis = new Lenis({ lerp: 0.1 });
  ctx.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const onClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    const target = hash === '#' ? null : document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector('.site-header');
    lenis.scrollTo(target, { offset: -(header?.offsetHeight ?? 0) });
    history.replaceState(null, '', hash);
  };
  root.addEventListener('click', onClick);

  return () => {
    root.removeEventListener('click', onClick);
    gsap.ticker.remove(raf);
    lenis.destroy();
    ctx.lenis = null;
  };
}
