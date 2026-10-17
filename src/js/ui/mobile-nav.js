// Accessible hamburger menu. Under 760px the nav becomes a full-height overlay.
export function init(nav) {
  const toggle = document.querySelector(`[aria-controls="${nav.id}"]`);
  if (!toggle) return undefined;
  const html = document.documentElement;

  const setOpen = (open, { focusToggle = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    html.classList.toggle('nav-open', open);
    if (open) nav.querySelector('a')?.focus();
    else if (focusToggle) toggle.focus();
  };

  const onToggle = () => setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  const onLink = (e) => { if (e.target.closest('a')) setOpen(false); };
  const onKey = (e) => { if (e.key === 'Escape' && html.classList.contains('nav-open')) setOpen(false, { focusToggle: true }); };

  toggle.addEventListener('click', onToggle);
  nav.addEventListener('click', onLink);
  document.addEventListener('keydown', onKey);
  return () => {
    toggle.removeEventListener('click', onToggle);
    nav.removeEventListener('click', onLink);
    document.removeEventListener('keydown', onKey);
  };
}
