// Endless people marquee: items are cloned once so the track can loop at -50%.
// Scroll velocity speeds it up briefly; hovering slows it down.
const BASE_SPEED = 40; // px per second

export function init(marquee, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const track = marquee.querySelector('.marquee__track');
  let loop;
  let hovered = false;
  let settleCall;

  // Clone once: the media slots inside the clones get wired up by video-slot, so they must
  // never be recreated (a resize only re-times the loop).
  for (const item of [...track.children]) {
    const clone = item.cloneNode(true);
    clone.dataset.clone = '';
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }
  const build = () => {
    const progress = loop?.progress() ?? 0;
    loop?.kill();
    const half = track.scrollWidth / 2;
    loop = gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: half / BASE_SPEED / ctx.speed, ease: 'none', repeat: -1 });
    loop.progress(progress).timeScale(hovered ? 0.2 : 1);
  };
  build();

  const settle = () => gsap.to(loop, { timeScale: hovered ? 0.2 : 1, duration: 0.6, ease: 'power2.out', overwrite: true });

  const triggers = [
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        if (hovered) return;
        const boost = 1 + gsap.utils.clamp(0, 3, Math.abs(self.getVelocity()) / 600);
        gsap.to(loop, { timeScale: boost, duration: 0.15, overwrite: true });
        settleCall?.kill();
        settleCall = gsap.delayedCall(0.3, settle);
      },
    }),
  ];

  const onEnter = () => { hovered = true; settle(); };
  const onLeave = () => { hovered = false; settle(); };
  marquee.addEventListener('pointerenter', onEnter);
  marquee.addEventListener('pointerleave', onLeave);

  // Recompute the loop width whenever ScrollTrigger refreshes (resize, orientation change).
  let lastWidth = window.innerWidth;
  const onRefreshInit = () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    build();
  };
  ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

  return () => {
    settleCall?.kill();
    loop?.kill();
    triggers.forEach((t) => t.kill());
    ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
    marquee.removeEventListener('pointerenter', onEnter);
    marquee.removeEventListener('pointerleave', onLeave);
    track.querySelectorAll('[data-clone]').forEach((n) => n.remove());
  };
}
