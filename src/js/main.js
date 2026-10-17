import '../styles/index.css';
import { init as initMobileNav } from './ui/mobile-nav.js';

const nav = document.querySelector('.mobile-nav');
if (nav) initMobileNav(nav);
