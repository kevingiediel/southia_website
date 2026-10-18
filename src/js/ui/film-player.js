// "Veja a Southia": a film card appears only once its poster exists in /media/films/,
// and the section only once one card does. Videos load when a card is opened.
const base = (id) => `/media/films/${id}`;

export function init(section, ctx) {
  const cards = [...section.querySelectorAll('.film-card')];
  const dialog = section.querySelector('.film-player');
  const video = dialog.querySelector('video');
  const close = dialog.querySelector('.film-player__close');
  let opener = null;

  for (const card of cards) {
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.onload = () => {
      card.querySelector('.film-card__poster').prepend(img);
      card.hidden = false;
      if (section.hidden) {
        section.hidden = false;
        // The page just grew: scroll-linked animations below must re-measure.
        if (document.documentElement.classList.contains('js-motion')) ctx?.ScrollTrigger?.refresh();
      }
    };
    img.src = `${base(card.dataset.film)}.jpg`;
  }

  const open = (card) => {
    const id = card.dataset.film;
    opener = card;
    video.poster = `${base(id)}.jpg`;
    video.src = video.canPlayType('video/webm') ? `${base(id)}.webm` : `${base(id)}.mp4`;
    video.querySelector('track')?.remove();
    const track = Object.assign(document.createElement('track'), { kind: 'captions', srclang: 'pt-BR', label: 'Português', src: `${base(id)}.vtt`, default: true });
    video.append(track);
    dialog.showModal();
    close.focus();
    video.play().catch(() => {}); // autoplay with sound may be refused; the controls stay available
  };

  const onClose = () => {
    video.pause();
    video.removeAttribute('src');
    video.load(); // stop downloading
    opener?.focus();
  };

  cards.forEach((card) => card.addEventListener('click', () => open(card)));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // backdrop
  dialog.addEventListener('close', onClose);
  return () => dialog.removeEventListener('close', onClose);
}
