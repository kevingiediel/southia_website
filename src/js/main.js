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

const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// [selector, module, root]: root 'self' = the matched element, 'doc' = document (module handles many).
const ALWAYS = [['.mobile-nav', mobileNav, 'self']];
const MOTION = [
  ['[data-smooth]', smoothScroll, 'doc'],
  ['.site-header', header, 'self'],
  ['[data-split]', textReveal, 'doc'],
  ['[data-reveal]', reveal, 'doc'],
];

function boot(registry, ctx) {
  for (const [selector, mod, scope] of registry) {
    const el = document.querySelector(selector);
    if (!el) continue;
    try {
      mod.init(scope === 'doc' ? document.documentElement : el, ctx);
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
