// Pure timing for the hero film loop (kept DOM-free so it can be unit tested).
// Each stop: zoom into the circle, dwell on the scene, zoom back out, rest on the ring.
export function stopSchedule(stops, { zoomIn = 1.1, dwell = 7, zoomOut = 0.9, rest = 1.2 } = {}) {
  const length = zoomIn + dwell + zoomOut + rest;
  return stops.map((stop, i) => ({
    id: stop.id,
    start: i * length,
    end: (i + 1) * length,
    zoomIn,
    dwell,
    zoomOut,
    rest,
  }));
}
