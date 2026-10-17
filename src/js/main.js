import '../styles/index.css';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motion } from './config.js';
import * as mobileNav from './ui/mobile-nav.js';
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
import * as videoSlot from './media/video-slot.js';

const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// [selector, module, root]: 'self' = the matched element, 'section' = its <section>, 'doc' = document (module handles many).
const ALWAYS = [['.mobile-nav', mobileNav, 'self']];
// Media boots last so it also sees the marquee's cloned slots.
const MEDIA = [['[data-media]', videoSlot, 'doc']];
const MOTION = [
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

function boot(registry, ctx) {
  for (const [selector, mod, scope] of registry) {
    const el = document.querySelector(selector);
    if (!el) continue;
    try {
      const root = scope === 'doc' ? document.documentElement : scope === 'section' ? el.closest('section') : el;
      mod.init(root, ctx);
    } catch (err) {
      console.warn('[motion] disabled:', err);
      html.classList.remove('js-motion');
    }
  }
}

const ctx = {
  gsap,
  ScrollTrigger,
  SplitText,
  lenis: null,
  speed: motion.speed,
  reduced,
  finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
};

boot(ALWAYS, ctx);

if (!reduced && html.classList.contains('js-motion')) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  boot(MOTION, ctx);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
}

boot(MEDIA, ctx);
