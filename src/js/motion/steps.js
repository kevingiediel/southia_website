// "Como trabalhamos": a progress line grows through the steps, lighting each dot; the photo drifts.
export function init(steps, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const line = steps.querySelector('.steps__line');
  const triggers = [];

  triggers.push(gsap.fromTo(line, { scaleY: 0 }, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: steps, start: 'top 70%', end: 'bottom 60%', scrub: true },
  }).scrollTrigger);

  for (const step of steps.querySelectorAll('.step')) {
    triggers.push(ScrollTrigger.create({
      trigger: step,
      start: 'top 65%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => step.classList.remove('is-active'),
    }));
  }

  const photo = document.querySelector('.como__media .media');
  if (photo) {
    triggers.push(gsap.fromTo(photo, { yPercent: -6 }, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
    }).scrollTrigger);
  }

  return () => triggers.forEach((t) => t.kill());
}
