import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappUrl, WHATSAPP } from '../../src/js/config.js';

test('placeholder number yields no link', () => {
  assert.equal(WHATSAPP, 'TODO_WHATSAPP');
  assert.equal(whatsappUrl('TODO_WHATSAPP', 'x'), null);
});

test('empty number yields no link', () => {
  assert.equal(whatsappUrl('', 'x'), null);
});

test('number is reduced to digits and text is encoded', () => {
  assert.equal(whatsappUrl('+55 (11) 99999-0000', 'Olá!'), 'https://wa.me/5511999990000?text=Ol%C3%A1!');
});
