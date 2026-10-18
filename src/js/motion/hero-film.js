import { stopSchedule } from './hero-film-schedule.js';
import { makeVideo } from '../media/make-video.js';

// Film 1 "A roda": after the hero intro, the camera dives into a circle of the ring,
// plays that business's scene with a code-built overlay, pulls back, and moves on.
export function init(section, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const film = section.querySelector('.hero-film');
  if (!film) return undefined;
  const scenes = [...film.querySelectorAll('.hero-film__scene')];
  const avatars = [...section.querySelectorAll('.hero__avatar')];
  const spark = section.querySelector('[data-spark]');
  const overlays = section.querySelector('.hero-film__overlays');
  const tag = overlays.querySelector('.hero-film__tag');
  const toggle = section.querySelector('.hero-film__toggle');
  const params = new URLSearchParams(location.search);
  const debugSpeed = params.has('debug') ? Number(params.get('filmspeed')) || 1 : 1;

  const schedule = stopSchedule(scenes.map((el) => ({ id: el.dataset.stop })));
  let master;
  let userPaused = false;
  let inView = true;
  let started = false;

  const log = params.has('debug') ? (window.__southia = { ...window.__southia, filmLog: [] }).filmLog : null;
  const setStop = (id) => { section.dataset.filmStop = id; log?.push(id); };

  // The scene's <video> is created the first time the stop is reached (or prefetched).
  const loadVideo = (scene) => {
    const existing = scene.querySelector('video');
    if (existing) return existing;
    const video = makeVideo(scene);
    if (scene.dataset.poster) video.poster = scene.dataset.poster;
    video.addEventListener('loadeddata', () => scene.classList.add('is-ready'), { once: true });
    video.load();
    return video;
  };

  // Where the circle sits right now (the ring rotates on scroll, so measure every loop).
  const origin = (scene) => {
    const circle = scene.dataset.circle;
    const target = circle === 'spark' ? spark : avatars[Number(circle)];
    const f = film.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const size = circle === 'spark' ? film.offsetWidth * 0.12 : target.offsetWidth;
    return {
      x: t.left + t.width / 2 - (f.left + f.width / 2),
      y: t.top + t.height / 2 - (f.top + f.height / 2),
      scale: size / film.offsetWidth,
    };
  };

  const overlayTl = (scene) => {
    const el = overlays.querySelector(`[data-for="${scene.dataset.stop}"]`);
    const tl = gsap.timeline();
    if (!el) return tl;
    tl.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    if (el.classList.contains('overlay--chat')) {
      const typing = el.querySelector('.chat__typing');
      el.querySelectorAll('.chat__msg').forEach((msg, i) => {
        const agent = msg.classList.contains('chat__msg--agente');
        if (agent) tl.set(typing, { display: 'flex' }).fromTo(typing, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }).set(typing, { display: 'none' }, '+=0.55');
        tl.set(msg, { display: 'block' }, i ? '+=0.45' : '+=0.2').fromTo(msg, { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)' });
      });
    }
    // Instagram grid and data feed: their pieces arrive one after another.
    const pops = el.querySelectorAll('[data-pop]');
    if (pops.length) tl.fromTo(pops, { autoAlpha: 0, y: 10, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.28, ease: 'back.out(1.6)' }, '+=0.1');
    return tl;
  };

  const hideOverlays = () => gsap.to(overlays.querySelectorAll('.overlay'), {
    autoAlpha: 0,
    duration: 0.3,
    onComplete: () => gsap.set(overlays.querySelectorAll('.chat__msg, .chat__typing'), { autoAlpha: 0, display: 'none' }),
  });

  const build = () => {
    master = gsap.timeline({ repeat: -1, onRepeat: () => master.invalidate() });
    gsap.set(scenes, { autoAlpha: 0 });
    gsap.set(overlays.querySelectorAll('.overlay'), { autoAlpha: 0 });
    gsap.set(overlays.querySelectorAll('.chat__msg, .chat__typing'), { autoAlpha: 0, display: 'none' });
    gsap.set(tag, { autoAlpha: 0 });

    schedule.forEach((stop, i) => {
      const scene = scenes[i];
      const next = scenes[(i + 1) % scenes.length];
      const video = () => scene.querySelector('video') ?? { pause() {} };
      const at = stop.start;
      const dwellAt = at + stop.zoomIn;
      const outAt = dwellAt + stop.dwell;

      master
        .call(() => {
          setStop(stop.id);
          loadVideo(scene).play().catch(() => {});
          tag.textContent = scene.dataset.tag;
        }, null, at)
        .fromTo(scene, {
          autoAlpha: 1,
          x: () => origin(scene).x,
          y: () => origin(scene).y,
          scale: () => origin(scene).scale,
        }, { x: 0, y: 0, scale: 1, duration: stop.zoomIn, ease: 'power3.inOut', immediateRender: false }, at)
        .call(() => loadVideo(next), null, dwellAt)
        .add(overlayTl(scene), dwellAt)
        .fromTo(tag, { autoAlpha: 0, y: -8 }, { autoAlpha: scene.dataset.tag ? 1 : 0, y: 0, duration: 0.4 }, dwellAt)
        .add(hideOverlays, outAt - 0.4)
        .to(tag, { autoAlpha: 0, duration: 0.3 }, outAt - 0.4)
        .to(scene, {
          x: () => origin(scene).x,
          y: () => origin(scene).y,
          scale: () => origin(scene).scale,
          duration: stop.zoomOut,
          ease: 'power3.inOut',
        }, outAt)
        .set(scene, { autoAlpha: 0 }, outAt + stop.zoomOut)
        .call(() => { setStop('ring'); video().pause(); }, null, outAt + stop.zoomOut);
    });
    master.timeScale(ctx.speed * debugSpeed);
  };

  const sync = () => {
    if (!master) return;
    const run = inView && !userPaused;
    if (run) master.play(); else master.pause();
    scenes.forEach((s) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (!run || section.dataset.filmStop !== s.dataset.stop) v.pause();
      else v.play().catch(() => {});
    });
  };

  const onToggle = () => {
    userPaused = !userPaused;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', userPaused ? 'Retomar animação' : 'Pausar animação');
    sync();
  };
  toggle.addEventListener('click', onToggle);

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { inView = self.isActive; sync(); },
  });

  const start = () => {
    if (started) return;
    started = true;
    build();
    sync();
  };
  if (section.dataset.introDone) start();
  else section.addEventListener('hero:intro-done', start, { once: true });

  return () => {
    master?.kill();
    st.kill();
    toggle.removeEventListener('click', onToggle);
    section.removeEventListener('hero:intro-done', start);
  };
}
