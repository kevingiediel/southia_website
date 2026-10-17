import { revealWords } from './text-reveal.js';

const fontsReady = () => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

// Hero "roda": intro build, scroll-linked rotation, and idle loops that pause off-screen.
export function init(section, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const q = (s) => gsap.utils.toArray(section.querySelectorAll(s));
  const ring = section.querySelector('.hero__ring-svg circle');
  const pops = q('.hero__pop');
  const spokes = q('.hero__spokes line');
  const spark = section.querySelector('[data-spark]');
  const title = section.querySelector('.hero__title');
  const copy = q('.hero__copy > :not(.hero__title)');

  const loops = [];
  const triggers = [];
  let intro;
  let cancelled = false;
  let inView = true;

  const buildLoops = () => {
    q('[data-bob]').forEach((el, i) => {
      const t = gsap.to(el, { y: -10, scale: 1.05, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
      t.totalTime(i * 0.42);
      loops.push(t);
    });
    q('[data-orbit]').forEach((el) => loops.push(gsap.to(el, { rotation: 360, duration: 9, ease: 'none', repeat: -1, paused: true })));
    q('[data-orbit-rev]').forEach((el) => loops.push(gsap.to(el, { rotation: -360, duration: 6, ease: 'none', repeat: -1, paused: true })));
    q('[data-pulse]').forEach((el) => loops.push(gsap.to(el, { scale: 1.12, opacity: 0.75, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true })));
    loops.push(gsap.to(spark, { scale: 1.15, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }));
    q('.hero__spark-glow').forEach((el) => loops.push(gsap.to(el, { opacity: 0.85, scale: 1.2, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true })));
    loops.forEach((t) => t.timeScale(ctx.speed));
  };
  const syncLoops = () => loops.forEach((t) => (inView ? t.play() : t.pause()));

  // Idle loops only run while the hero is on screen.
  triggers.push(ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { inView = self.isActive; if (section.dataset.introDone) syncLoops(); },
  }));

  // Scroll: the ring turns while people stay upright.
  triggers.push(gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } })
    .to(section.querySelector('.hero__rotor'), { rotation: 25, ease: 'none' }, 0)
    .to(pops, { rotation: -25, ease: 'none' }, 0)
    .to(section.querySelector('.hero__glow'), { yPercent: 15, ease: 'none' }, 0).scrollTrigger);

  fontsReady().then(() => {
    if (cancelled) return;
    gsap.set(title, { visibility: 'visible' });
    intro = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        section.dataset.introDone = 'true';
        buildLoops();
        syncLoops();
      },
    })
      .to(ring, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(pops, { scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' }, 0.3)
      .to(spokes, { strokeDashoffset: 0, duration: 0.5, stagger: 0.04 }, 0.6)
      .to(spark, { scale: 1, duration: 0.45, ease: 'back.out(2)' }, 0.9)
      .add(revealWords(title, ctx), 0.35)
      .to(copy, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.75);
    intro.timeScale(ctx.speed);
  });

  if (new URLSearchParams(location.search).has('debug')) window.__southia = { ...window.__southia, heroLoops: loops };

  return () => {
    cancelled = true;
    intro?.kill();
    loops.forEach((t) => t.kill());
    triggers.forEach((t) => t.kill());
  };
}
