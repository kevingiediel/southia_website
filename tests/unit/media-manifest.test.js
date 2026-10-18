import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mediaAttrs, readyStops, readyVideos } from '../../vite-plugins/media.js';

const have = (...files) => (p) => files.includes(p);

test('mediaAttrs emits only the files that exist', () => {
  assert.equal(mediaAttrs('/media/hero-p1', have('/media/hero-p1.jpg', '/media/hero-p1.mp4')),
    'data-poster="/media/hero-p1.jpg" data-src="/media/hero-p1.mp4"');
  assert.equal(mediaAttrs('/media/row-1', have()), '');
});

test('readyStops keeps only hero film stops with a clip', () => {
  const stops = [{ id: 'barbearia' }, { id: 'clinica' }];
  assert.deepEqual(readyStops(stops, have('/media/film/barbearia.mp4')).map((s) => s.id), ['barbearia']);
  assert.deepEqual(readyStops(stops, have('/media/film/clinica.webm')).map((s) => s.id), ['clinica']);
});

test('readyVideos keeps only films whose poster and video exist', () => {
  const videos = [{ id: 'film-1' }, { id: 'film-2' }];
  assert.deepEqual(readyVideos(videos, have('/media/films/film-2.jpg', '/media/films/film-2.mp4', '/media/films/film-1.jpg')).map((v) => v.id), ['film-2']);
});
