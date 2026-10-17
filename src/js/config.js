export const SITE_URL = 'https://southia.com.br/';
export const EMAIL = 'ola@southia.com.br';
export const motion = { speed: 1 };

// TODO: replace with Southia's WhatsApp number (e.g. '+55 11 99999-0000').
// While this is the placeholder, the WhatsApp button is left out of the page.
export const WHATSAPP = 'TODO_WHATSAPP';
export const WHATSAPP_TEXT = 'Olá! Quero conversar com a Southia.';

export function whatsappUrl(number, text) {
  if (!number || number.startsWith('TODO')) return null;
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}
