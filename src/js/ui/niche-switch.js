// Southia Atende niche picker: each button shows its sample WhatsApp conversation.
// The markup already shows the first one, so the page reads fine without this module.
export function init(root) {
  const chips = [...root.querySelectorAll('.niches__chip')];
  const chats = [...root.querySelectorAll('.niche-chat')];
  if (!chips.length) return undefined;

  const select = (id) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.niche === id)));
    chats.forEach((c) => { c.hidden = c.dataset.niche !== id; });
  };
  const onClick = (e) => {
    const chip = e.target.closest('.niches__chip');
    if (chip) select(chip.dataset.niche);
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
