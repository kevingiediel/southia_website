// Build-time media awareness: the HTML only references media files that exist in public/,
// so visitors never request (and get 404s for) clips that haven't been produced yet.
import fs from 'node:fs';
import path from 'node:path';

// exists('/media/x.jpg') → is public/media/x.jpg there? SOUTHIA_ALL_MEDIA=1 (tests) pretends yes.
export function mediaExists(publicDir, { all = process.env.SOUTHIA_ALL_MEDIA === '1' } = {}) {
  return (p) => all || fs.existsSync(path.join(publicDir, p));
}

const ATTRS = [['data-poster', 'jpg'], ['data-webm', 'webm'], ['data-src', 'mp4']];

export function mediaAttrs(base, exists) {
  return ATTRS.filter(([, ext]) => exists(`${base}.${ext}`)).map(([attr, ext]) => `${attr}="${base}.${ext}"`).join(' ');
}

export const readyStops = (stops, exists) =>
  stops.filter((s) => exists(`/media/film/${s.id}.mp4`) || exists(`/media/film/${s.id}.webm`));

export const readyVideos = (videos, exists) =>
  videos.filter((v) => exists(`/media/films/${v.id}.jpg`) && (exists(`/media/films/${v.id}.mp4`) || exists(`/media/films/${v.id}.webm`)));
