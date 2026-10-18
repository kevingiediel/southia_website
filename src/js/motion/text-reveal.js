// Word-mask headline reveals. Splitting waits for webfonts so masks match final line breaks.
function split(el, ctx) {
  return ctx.SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'word' });
}

export function init(root, ctx) {
  const { gsap, ScrollTrigger } = ctx;
  const splits = [];
  let cancelled = false;

  document.fonts.ready
    .then(() => {
      if (cancelled) return;
      for (const el of root.querySelectorAll('[data-split]:not([data-split="hero"])')) {
        const s = split(el, ctx);
        splits.push(s);
        gsap.from(s.words, {
          yPercent: 110,
          duration: 0.9 / ctx.speed,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      }
      ScrollTrigger.refresh();
    })
    .catch((err) => console.warn('[motion] text-reveal skipped:', err));

  return () => {
    cancelled = true;
    splits.forEach((s) => s.revert());
  };
}
