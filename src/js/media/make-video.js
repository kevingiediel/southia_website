// Builds a muted looping <video> from a container's data-webm / data-src (mp4) attributes.
// Videos are created on demand: <video> elements in the initial HTML make the first frame slower.
export function makeVideo(el) {
  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto' });
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  for (const [attr, type] of [['webm', 'video/webm'], ['src', 'video/mp4']]) {
    if (!el.dataset[attr]) continue;
    const source = document.createElement('source');
    source.type = type;
    source.src = el.dataset[attr];
    video.append(source);
  }
  el.prepend(video);
  return video;
}
