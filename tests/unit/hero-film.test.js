import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stopSchedule, finaleSchedule } from '../../src/js/motion/hero-film-schedule.js';

const stops = ['barbearia', 'clinica', 'advocacia', 'roda'].map((id) => ({ id }));

test('schedule keeps stop order and starts at zero', () => {
  const s = stopSchedule(stops);
  assert.deepEqual(s.map((x) => x.id), ['barbearia', 'clinica', 'advocacia', 'roda']);
  assert.equal(s[0].start, 0);
});

test('stops are contiguous and each lasts zoomIn + dwell + zoomOut + fade + rest', () => {
  const opts = { zoomIn: 1, dwell: 5, zoomOut: 1, fade: 1, rest: 2 };
  const s = stopSchedule(stops, opts);
  s.forEach((x, i) => {
    assert.equal(x.end - x.start, 10);
    if (i) assert.equal(x.start, s[i - 1].end);
  });
  assert.equal(s.at(-1).end, 40);
});

test('default loop is about 40 seconds', () => {
  const total = stopSchedule(stops).at(-1).end;
  assert.ok(total >= 36 && total <= 44, `total ${total}`);
});

test('the scene fades only after it is back in its circle', () => {
  const [s] = stopSchedule(stops);
  assert.ok(s.fade >= 0.8, `fade ${s.fade}`);
  assert.equal(s.end - s.start, s.zoomIn + s.dwell + s.zoomOut + s.fade + s.rest);
});

test('the loop ends by zooming into "+ você" right after the last stop', () => {
  const s = stopSchedule(stops);
  const f = finaleSchedule(s.at(-1).end);
  assert.equal(f.start, s.at(-1).end);
  assert.ok(Math.abs((f.end - f.start) - (f.zoomIn + f.dwell + f.zoomOut + f.fade + f.rest)) < 1e-9);
  assert.ok(f.dwell >= 3, `the invitation stays readable (${f.dwell}s)`);
});
