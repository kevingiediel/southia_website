// Higgsfield video slots: poster and clip load only near the viewport, clips play only while
// visible, and a slot with nothing to show keeps the brand placeholder.
export function init(root, ctx) {
  const figures = [...root.querySelectorAll('[data-media]')].filter((f) => f.querySelector('video'));
  const allowVideo = !ctx.reduced && !navigator.connection?.saveData;

  const state = new Map(); // figure -> { posterFailed, videoFailed }
  const markFallback = (fig) => {
    const s = state.get(fig);
    if (s.posterFailed && (s.videoFailed || !allowVideo)) fig.classList.add('media--fallback');
  };

  const load = (fig) => {
    const video = fig.querySelector('video');
    const s = { posterFailed: false, videoFailed: false };
    state.set(fig, s);

    const poster = video.dataset.poster;
    if (poster) {
      const img = new Image();
      img.onload = () => { video.poster = poster; fig.classList.add('media--poster'); };
      img.onerror = () => { s.posterFailed = true; markFallback(fig); };
      img.src = poster;
    }
    if (!allowVideo) return;

    const sources = [...video.querySelectorAll('source[data-src]')];
    sources.at(-1)?.addEventListener('error', () => { s.videoFailed = true; markFallback(fig); }, { once: true });
    video.addEventListener('loadeddata', () => fig.classList.add('media--ready'), { once: true });
    for (const src of sources) src.src = src.dataset.src;
    video.load();
  };

  const nearObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      nearObserver.unobserve(e.target);
      load(e.target);
      if (allowVideo) playObserver.observe(e.target);
    }
  }, { rootMargin: '200px' });

  const playObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const video = e.target.querySelector('video');
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
