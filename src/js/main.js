import '../styles/index.css';
import { motion } from './config.js';
import { boot } from './boot.js';
import * as mobileNav from './ui/mobile-nav.js';
import * as videoSlot from './media/video-slot.js';
import * as filmPlayer from './ui/film-player.js';

const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ALWAYS = [['.mobile-nav', mobileNav, 'self'], ['#filmes', filmPlayer, 'self']];
// Media boots after motion so it also sees the marquee's cloned slots.
const MEDIA = [['[data-media]', videoSlot, 'doc']];

// Shared with every module; the motion layer adds gsap, ScrollTrigger, SplitText and lenis.
const ctx = {
  lenis: null,
  speed: motion.speed,
  reduced,
  finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
};

boot(ALWAYS, ctx);

if (!reduced && html.classList.contains('js-motion')) {
  // Let the browser paint the page first, then load and start the motion layer.
  requestAnimationFrame(() => setTimeout(() => {
    import('./motion-boot.js')
      .then((m) => m.start(ctx))
      .catch((err) => { console.warn('[motion] disabled:', err); html.classList.remove('js-motion'); })
      .finally(() => boot(MEDIA, ctx));
  }, 0));
} else {
  boot(MEDIA, ctx);
}
