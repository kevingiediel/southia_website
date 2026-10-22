import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { slotSpec, ffmpegArgs } from '../../scripts/process-media.mjs';

const site = JSON.parse(fs.readFileSync(new URL('../../src/data/site.json', import.meta.url), 'utf8'));

test('hero slots are 360x360 circles with the small budget', () => {
  assert.deepEqual(slotSpec('hero-p3', site), { id: 'hero-p3', shape: 'circle', width: 360, height: 360, budget: 300_000 });
});

test('marquee slots keep their shape from site.json', () => {
  assert.equal(slotSpec('row-2', site).shape, 'rounded');
  assert.equal(slotSpec('row-1', site).shape, 'pill');
});

test('product slots are 800x500', () => {
  const s = slotSpec('prod-4', site);
  assert.equal(s.width, 800);
  assert.equal(s.height, 500);
  assert.equal(s.budget, 800_000);
});

test('como-foto is 800x1000', () => {
  const s = slotSpec('como-foto', site);
  assert.equal(s.width, 800);
  assert.equal(s.height, 1000);
});

test('unknown slot throws', () => {
  assert.throws(() => slotSpec('nope', site), /Unknown slot/);
});

test('mp4 args strip audio, enable faststart and crop to size', () => {
  const args = ffmpegArgs('a.mp4', slotSpec('hero-p1', site), 'mp4');
  assert.ok(args.includes('-an'));
  assert.ok(args.includes('+faststart'));
  assert.ok(args.some((a) => a.includes('crop=360:360')));
});

test('jpg args take a single frame', () => {
  const args = ffmpegArgs('a.mp4', slotSpec('prod-1', site), 'jpg');
  assert.ok(args.includes('-frames:v'));
  assert.equal(args[args.indexOf('-frames:v') + 1], '1');
});

test('hero film scenes are 720x720 with a 1.2 MB budget', () => {
  assert.deepEqual(slotSpec('film/barbearia', site), { id: 'film/barbearia', shape: 'circle', width: 720, height: 720, budget: 1_200_000 });
  assert.throws(() => slotSpec('film/nope', site), /Unknown slot/);
});

test('the spark scene (roda) is a tall frame shaped like the diamond', () => {
  assert.deepEqual(slotSpec('film/roda', site), { id: 'film/roda', shape: 'spark', width: 424, height: 720, budget: 1_200_000 });
});
