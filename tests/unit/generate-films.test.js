import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shotArgs, resultUrl, gateShots } from '../../scripts/generate-films.mjs';

const paths = { frame: (n) => `media-src/frames/${n}.png`, still: (n) => `media-src/films/${n}.png` };

test('still shot uses its model, aspect and the shared style prefix', () => {
  const args = shotArgs({ id: 'F1-barbearia', kind: 'still', model: 'text2image_soul_v2', prompt: 'Barbershop.' }, paths, { style: 'STYLE.' });
  assert.deepEqual(args.slice(0, 3), ['generate', 'create', 'text2image_soul_v2']);
  assert.equal(args[args.indexOf('--prompt') + 1], 'STYLE. Barbershop.');
  assert.equal(args[args.indexOf('--aspect_ratio') + 1], '16:9');
  assert.ok(args.includes('--wait') && args.includes('--json'));
});

test('video shot maps frame and still inputs to start/end images', () => {
  const args = shotArgs({ id: 'F1-02', kind: 'video', start: 'frame:logo-zoom-barbearia', end: 'still:F1-barbearia', duration: 4, prompt: 'Fly in.' }, paths, { motion: 'MOTION.' });
  assert.equal(args[2], 'seedance_2_5');
  assert.equal(args[args.indexOf('--start-image') + 1], 'media-src/frames/logo-zoom-barbearia.png');
  assert.equal(args[args.indexOf('--end-image') + 1], 'media-src/films/F1-barbearia.png');
  assert.equal(args[args.indexOf('--mode') + 1], 'omni_reference');
  assert.equal(args[args.indexOf('--duration') + 1], '4');
  assert.equal(args[args.indexOf('--prompt') + 1], 'Fly in. MOTION.');
});

test('video shots never ask for generated audio', () => {
  const args = shotArgs({ id: 'X', kind: 'video', start: 'frame:a', duration: 6, prompt: 'p' }, paths, {});
  assert.ok(!args.includes('--generate-audio') || args[args.indexOf('--generate-audio') + 1] === 'false');
});

test('resultUrl finds the media URL anywhere in the job JSON', () => {
  const json = [{ id: 'j1', status: 'completed', result: { outputs: [{ url: 'https://cdn.example/x/abc.mp4' }] } }];
  assert.equal(resultUrl(json), 'https://cdn.example/x/abc.mp4');
  assert.equal(resultUrl({ data: { image_url: 'https://cdn.example/i.png?sig=1' } }), 'https://cdn.example/i.png?sig=1');
  assert.equal(resultUrl({ nothing: true }), null);
});

test('gate 1 is the barbershop sequence only', () => {
  const shots = [{ id: 'F1-barbearia', gate: 1 }, { id: 'F1-01', gate: 1 }, { id: 'F1-06', gate: 2 }];
  assert.deepEqual(gateShots(shots, 1).map((s) => s.id), ['F1-barbearia', 'F1-01']);
});

test('audio shot uses Seed Audio and resultUrl accepts audio files', () => {
  const args = shotArgs({ id: 'F1-som', kind: 'audio', prompt: 'Warm guitar.' }, paths, {});
  assert.deepEqual(args.slice(0, 3), ['generate', 'create', 'seed_audio']);
  assert.equal(args[args.indexOf('--prompt') + 1], 'Warm guitar.');
  assert.equal(resultUrl({ audio: 'https://cdn.example/a.mp3' }), 'https://cdn.example/a.mp3');
});
