// Contato logo: the ring of people turns slowly around the pulsing spark; paused off-screen.
export function init(el, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const ring = el.querySelectorAll('.logo__ring, .logo__spokes, .logo__ink, .logo__bg, .logo__you');
  const ember = el.querySelector('.logo__ember');

  const loops = [
    gsap.to(ring, { rotation: 360, svgOrigin: '100 100', duration: 40, ease: 'none', repeat: -1, paused: true }),
    gsap.to(ember, { scale: 1.15, transformOrigin: '50% 50%', duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }),
  ];
  loops.forEach((t) => t.timeScale(ctx.speed));

  const st = ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => loops.forEach((t) => (self.isActive ? t.play() : t.pause())),
  });

  return () => {
    st.kill();
    loops.forEach((t) => t.kill());
  };
}
