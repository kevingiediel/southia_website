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

test('video resolution comes from the shot list (default 1080p)', () => {
  const shot = { id: 'X', kind: 'video', start: 'frame:a', duration: 4, prompt: 'p' };
  assert.equal(shotArgs(shot, paths, {}).at(shotArgs(shot, paths, {}).indexOf('--resolution') + 1), '1080p');
  const args = shotArgs(shot, paths, { resolution: '720p' });
  assert.equal(args[args.indexOf('--resolution') + 1], '720p');
});

test('resultUrl prefers result_url and ignores input media inside params', () => {
  const job = [{ params: { medias: [{ data: { url: 'https://cdn.example/in.png' } }] }, result_url: 'https://cdn.example/out.mp4', status: 'completed' }];
  assert.equal(resultUrl(job), 'https://cdn.example/out.mp4');
  assert.equal(resultUrl([{ params: { medias: [{ data: { url: 'https://cdn.example/in.png' } }] }, result_url: null }]), null);
});

test('video shots explicitly disable generated audio', () => {
  const args = shotArgs({ id: 'X', kind: 'video', start: 'frame:a', duration: 4, prompt: 'p' }, paths, {});
  assert.equal(args[args.indexOf('--generate_audio') + 1], 'false');
});

test('findPreviousJob reuses a completed job with the same model and prompt', async () => {
  const { findPreviousJob } = await import('../../scripts/generate-films.mjs');
  const args = shotArgs({ id: 'X', kind: 'video', start: 'frame:a', duration: 4, prompt: 'Fly in.' }, paths, { motion: 'M.' });
  const jobs = [
    { job_type: 'seedance_2_5', status: 'in_progress', params: { prompt: 'Fly in. M.', medias: [{ role: 'start_image' }] }, result_url: null },
    { job_type: 'seedance_2_5', status: 'completed', params: { prompt: 'Fly in. M.', medias: [{ role: 'start_image' }] }, result_url: 'https://cdn.example/a.mp4' },
    { job_type: 'kling3_0', status: 'completed', params: { prompt: 'Fly in. M.', medias: [{ role: 'start_image' }] }, result_url: 'https://cdn.example/b.mp4' },
  ];
  assert.equal(findPreviousJob(jobs, args)?.result_url, 'https://cdn.example/a.mp4');
  assert.equal(findPreviousJob(jobs, shotArgs({ id: 'Y', kind: 'video', start: 'frame:a', prompt: 'Other.' }, paths, {})), null);
});

test('findPendingJob finds an identical job still running', async () => {
  const { findPendingJob } = await import('../../scripts/generate-films.mjs');
  const args = shotArgs({ id: 'X', kind: 'video', start: 'frame:a', duration: 4, prompt: 'Fly in.' }, paths, {});
  const prompt = args[args.indexOf('--prompt') + 1];
  const jobs = [
    { id: 'done', job_type: 'seedance_2_5', status: 'failed', params: { prompt, medias: [{ role: 'start_image' }] } },
    { id: 'run', job_type: 'seedance_2_5', status: 'in_progress', params: { prompt, medias: [{ role: 'start_image' }] } },
  ];
  assert.equal(findPendingJob(jobs, args)?.id, 'run');
  assert.equal(findPendingJob([{ id: 'q', job_type: 'seedance_2_5', status: 'queued', params: { prompt, medias: [{ role: 'start_image' }] } }], args)?.id, 'q');
  assert.equal(findPendingJob([], args), null);
});

test('previous/pending jobs must match resolution, duration and input frames, not just the prompt', async () => {
  const { findPreviousJob, findPendingJob } = await import('../../scripts/generate-films.mjs');
  const shot = { id: 'X', kind: 'video', start: 'frame:a', end: 'frame:b', duration: 4, prompt: 'Fly in.' };
  const args = shotArgs(shot, paths, { resolution: '1080p' });
  const prompt = args[args.indexOf('--prompt') + 1];
  const base = { job_type: 'seedance_2_5', status: 'completed', result_url: 'https://cdn.example/a.mp4' };
  const medias = [{ role: 'start_image' }, { role: 'end_image' }];
  assert.equal(findPreviousJob([{ ...base, params: { prompt, resolution: '720p', duration: 4, medias } }], args), null);
  assert.equal(findPreviousJob([{ ...base, params: { prompt, resolution: '1080p', duration: 6, medias } }], args), null);
  assert.equal(findPreviousJob([{ ...base, params: { prompt, resolution: '1080p', duration: 4, medias: [medias[0]] } }], args), null);
  assert.ok(findPreviousJob([{ ...base, params: { prompt, resolution: '1080p', duration: 4, medias } }], args));
  assert.equal(findPendingJob([{ ...base, status: 'in_progress', params: { prompt, resolution: '720p', duration: 4, medias } }], args), null);
});
