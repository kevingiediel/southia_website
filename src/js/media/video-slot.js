// Higgsfield video slots: poster and clip load only near the viewport, clips play only while
// visible, and a slot with nothing to show keeps the brand placeholder.
import { makeVideo } from './make-video.js';

export function init(root, ctx) {
  const figures = [...root.querySelectorAll('[data-media]')];
  const allowVideo = !ctx.reduced && !navigator.connection?.saveData;

  const state = new Map(); // figure -> { posterFailed, videoFailed }
  const markFallback = (fig) => {
    const s = state.get(fig);
    if (s.posterFailed && (s.videoFailed || !s.hasVideo)) fig.classList.add('media--fallback');
  };

  const load = (fig) => {
    const s = { posterFailed: false, videoFailed: false };
    state.set(fig, s);
    // Photo-only slots get no <video>: the photo is the slot's background, which every browser shows
    // (an empty video's poster isn't drawn everywhere).
    const hasClip = Boolean(fig.dataset.src || fig.dataset.webm);
    const video = allowVideo && hasClip ? makeVideo(fig) : null;

    s.hasVideo = Boolean(video);
    const poster = fig.dataset.poster;
    if (poster) {
      const img = new Image();
      img.onload = () => { if (video) video.poster = poster; else fig.style.backgroundImage = `url("${poster}")`; fig.classList.add('media--poster'); };
      img.onerror = () => { s.posterFailed = true; markFallback(fig); };
      img.src = poster;
    }
    if (!video) return;

    video.querySelector('source:last-of-type')?.addEventListener('error', () => { s.videoFailed = true; markFallback(fig); }, { once: true });
    video.addEventListener('loadeddata', () => fig.classList.add('media--ready'), { once: true });
    video.load();
  };

  const nearObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      nearObserver.unobserve(e.target);
      load(e.target);
      if (e.target.querySelector('video')) playObserver.observe(e.target);
    }
  }, { rootMargin: '200px' });

  const playObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const video = e.target.querySelector('video');
      if (!video) continue;
      if (e.isIntersecting) video.play().catch(() => {}); // autoplay refused: the poster stays
      else video.pause();
    }
  }, { threshold: 0.25 });

  figures.forEach((f) => nearObserver.observe(f));
  return () => {
    nearObserver.disconnect();
    playObserver.disconnect();
  };
}
