// Pure timing for the hero film loop (kept DOM-free so it can be unit tested).
// Each stop: zoom into the circle, dwell on the scene, shrink back into the circle (still fully visible),
// fade out slowly inside it, rest on the ring.
export function stopSchedule(stops, { zoomIn = 1.1, dwell = 6.6, zoomOut = 1.3, fade = 1.1, rest = 0.6 } = {}) {
  const length = zoomIn + dwell + zoomOut + fade + rest;
  return stops.map((stop, i) => ({
    id: stop.id,
    start: i * length,
    end: (i + 1) * length,
    zoomIn,
    dwell,
    zoomOut,
    fade,
    rest,
  }));
}

// After the last stop the camera zooms into the "+ você" circle with an invitation, then returns.
export function finaleSchedule(start, { zoomIn = 1.1, dwell = 3.6, zoomOut = 1.3, fade = 1.1, rest = 0.8 } = {}) {
  return { id: 'voce', start, end: start + zoomIn + dwell + zoomOut + fade + rest, zoomIn, dwell, zoomOut, fade, rest };
}
