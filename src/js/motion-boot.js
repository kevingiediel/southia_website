// Motion layer, loaded after the first paint by main.js so the page renders before
// GSAP, SplitText and the scroll effects are evaluated.
import 'lenis/dist/lenis.css';
import { boot } from './boot.js';
import * as motionToggle from './motion/motion-toggle.js';
import * as smoothScroll from './motion/smooth-scroll.js';
import * as header from './motion/header.js';
import * as textReveal from './motion/text-reveal.js';
import * as reveal from './motion/reveal.js';
import * as heroRing from './motion/hero-ring.js';
import * as heroFilm from './motion/hero-film.js';
import * as marquee from './motion/marquee.js';
import * as steps from './motion/steps.js';
import * as tilt from './motion/tilt.js';
import * as magnetic from './motion/magnetic.js';

const MOTION = [
  ['.motion-toggle', motionToggle, 'self'],
  ['[data-smooth]', smoothScroll, 'doc'],
  ['.site-header', header, 'self'],
  ['[data-split]', textReveal, 'doc'],
  ['[data-reveal]', reveal, 'doc'],
  ['#topo', heroRing, 'self'],
  ['.hero-film', heroFilm, 'section'],
  ['.marquee', marquee, 'self'],
  ['.steps', steps, 'self'],
  ['.cards', tilt, 'self'],
  ['[data-magnetic]', magnetic, 'doc'],
];

// Yield to the browser between modules so start-up never becomes one long blocking task.
const nextTask = () => (globalThis.scheduler?.yield ? scheduler.yield() : new Promise((r) => setTimeout(r, 0)));

export async function start(ctx) {
  // Each library is its own chunk, evaluated in its own task (one big bundle blocks the main thread).
  const { gsap } = await import('gsap');
  await nextTask();
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  await nextTask();
  const { SplitText } = await import('gsap/SplitText');
  await nextTask();
  Object.assign(ctx, { gsap, ScrollTrigger, SplitText });
  gsap.registerPlugin(ScrollTrigger, SplitText);
  for (const entry of MOTION) {
    boot([entry], ctx);
    await nextTask();
  }
  ScrollTrigger.refresh();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
  dispatchEvent(new Event('southia:motion-ready'));
}
