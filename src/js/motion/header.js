// Transparent over the hero, solid once scrolled; hides going down, returns going up.
export function init(header, ctx) {
  const html = document.documentElement;
  let lastY = window.scrollY;

  const st = ctx.ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: () => {
      const y = window.scrollY;
      header.classList.toggle('is-solid', y > 40);
      if (html.classList.contains('nav-open')) header.classList.remove('is-hidden');
      else if (y > lastY + 8 && y > 200) header.classList.add('is-hidden');
      else if (y < lastY - 8 || y <= 200) header.classList.remove('is-hidden');
      if (Math.abs(y - lastY) > 8 || y <= 200) lastY = y;
    },
  });
  header.classList.toggle('is-solid', window.scrollY > 40);

  // Keyboard users tabbing into a hidden header bring it back.
  const onFocus = () => header.classList.remove('is-hidden');
  header.addEventListener('focusin', onFocus);

  return () => {
    st.kill();
    header.removeEventListener('focusin', onFocus);
    header.classList.remove('is-solid', 'is-hidden');
  };
}
