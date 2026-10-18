import { test, expect } from '@playwright/test';

test('content renders with JavaScript disabled', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Pessoas, dados e IA na mesma roda.');
  await expect(page.locator('.card h3')).toHaveCount(6);
  await expect(page.locator('.card h3').first()).toBeVisible();
  for (const id of ['topo', 'solucoes', 'como', 'contato']) await expect(page.locator(`#${id}`)).toHaveCount(1);
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const toggle = page.locator('.nav-toggle');
  await expect(page.locator('#site-nav a', { hasText: 'Soluções' })).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#site-nav a', { hasText: 'Soluções' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('no horizontal page scroll on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const [scroll, client] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(scroll).toBe(client);
});

test('reduced motion shows all content', async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/js-motion/);
  for (const el of await page.locator('[data-reveal]').all()) await expect(el).toHaveCSS('opacity', '1');
});

test('motion is enabled when allowed', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/js-motion/);
});

test('no console errors on load and scroll', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test('anchor link lands below the header', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.site-header a[href="#solucoes"]').click();
  await page.waitForTimeout(1800);
  const top = await page.locator('#solucoes h2').evaluate((e) => e.getBoundingClientRect().top);
  const header = await page.locator('.site-header').evaluate((e) => e.getBoundingClientRect().bottom);
  expect(top).toBeGreaterThanOrEqual(Math.max(header, 0));
  expect(top).toBeLessThan(400);
});

test('split headlines keep their text', async ({ page }) => {
  await page.goto('/');
  await page.locator('#solucoes').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await expect(page.locator('#solucoes h2')).toHaveText('Seis formas de fazer o seu negócio girar.');
  await expect(page.locator('#solucoes h2 .word').first()).toBeVisible();
});

test('hero intro completes and loops pause off-screen', async ({ page }) => {
  await page.goto('/?debug');
  await expect(page.locator('#topo')).toHaveAttribute('data-intro-done', 'true', { timeout: 4000 });
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('#contato').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const paused = await page.evaluate(() => window.__southia?.heroLoops?.length > 0 && window.__southia.heroLoops.every((t) => t.paused()));
  expect(paused).toBe(true);
});

test('marquee loops seamlessly and survives resize', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const items = page.locator('.marquee__track > *');
  await expect(items).toHaveCount(16);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(800);
  await expect(items).toHaveCount(16);
  expect(errors).toEqual([]);
});

test('steps activate on scroll', async ({ page }) => {
  await page.goto('/');
  await page.locator('.steps').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1000);
  await expect(page.locator('.step.is-active').first()).toBeVisible();
});

test('missing media falls back to placeholder', async ({ page }) => {
  await page.route('**/media/prod-1.*', (r) => r.fulfill({ status: 404 }));
  await page.goto('/');
  const slot = page.locator('[data-media="prod-1"]');
  await slot.scrollIntoViewIfNeeded();
  await expect(slot).toHaveClass(/media--fallback/, { timeout: 4000 });
});

test('rejected autoplay keeps poster quietly', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('blocked', 'NotAllowedError'));
  });
  await page.route('**/media/hero-p1.*', (r) => r.fulfill({ path: `tests/fixtures/tiny.${new URL(r.request().url()).pathname.split('.').pop()}` }));
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('[data-media="hero-p1"]')).not.toHaveClass(/media--fallback/);
  await expect(page.locator('[data-media="hero-p1"] video')).toHaveAttribute('poster', '/media/hero-p1.jpg');
  expect(errors.filter((e) => !/404|Failed to load resource/.test(e))).toEqual([]);
});

test('video loads and plays when a clip exists', async ({ page }) => {
  await page.route('**/media/hero-p2.*', (r) => r.fulfill({ path: `tests/fixtures/tiny.${new URL(r.request().url()).pathname.split('.').pop()}` }));
  await page.goto('/');
  await expect(page.locator('[data-media="hero-p2"]')).toHaveClass(/media--ready/, { timeout: 5000 });
});

test('no WhatsApp link while the number is a placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.locator('#contato a[href^="mailto:ola@southia.com.br"]').first()).toBeVisible();
});

test('custom 404 page is served', async ({ page }) => {
  const res = await page.goto('/404.html');
  expect(res.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Página não encontrada');
});

const routeFilmClips = (page, seen = []) => page.route('**/media/film/**', (r) => {
  seen.push(r.request().url());
  r.fulfill({ path: `tests/fixtures/tiny.${new URL(r.request().url()).pathname.split('.').pop()}` });
});

test('hero film visits each stop in order and returns to the ring', async ({ page }) => {
  await routeFilmClips(page);
  await page.goto('/?debug&filmspeed=10');
  await page.waitForFunction(() => window.__southia?.filmLog?.length >= 8, null, { timeout: 15000 });
  const stops = await page.evaluate(() => window.__southia.filmLog.slice(0, 8));
  expect(stops).toEqual(['barbearia', 'ring', 'clinica', 'ring', 'advocacia', 'ring', 'roda', 'ring']);
});

test('hero film chat overlay shows the conversation', async ({ page }) => {
  await routeFilmClips(page);
  await page.goto('/?debug&filmspeed=4');
  await expect(page.locator('.overlay--chat .chat__msg').last()).toBeVisible({ timeout: 8000 });
  await expect(page.locator('.overlay--chat')).toContainText('Prontinho');
});

test('pause button stops the hero film', async ({ page }) => {
  await routeFilmClips(page);
  await page.goto('/?debug&filmspeed=10');
  await expect(page.locator('#topo')).toHaveAttribute('data-film-stop', /.+/, { timeout: 6000 });
  const toggle = page.locator('.hero-film__toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const before = await page.locator('#topo').getAttribute('data-film-stop');
  await page.waitForTimeout(1500);
  await expect(page.locator('#topo')).toHaveAttribute('data-film-stop', before);
});

test('no film clips load before the intro or with reduced motion', async ({ browser, page }) => {
  const seen = [];
  await routeFilmClips(page, seen);
  await page.goto('/?debug');
  const atLoad = seen.length;
  expect(atLoad).toBe(0);

  const reducedSeen = [];
  const reduced = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await routeFilmClips(reduced, reducedSeen);
  await reduced.goto('/');
  await reduced.waitForTimeout(3000);
  expect(reducedSeen).toEqual([]);
  await expect(reduced.locator('#topo')).not.toHaveAttribute('data-film-stop', /.+/);
});

test('header, footer and contato use the official brand files', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-header img.brand__logo')).toHaveAttribute('src', /horizontal-negativa.*\.svg$/);
  await expect(page.locator('.site-footer img.brand__logo')).toHaveAttribute('src', /horizontal-negativa.*\.svg$/);
  await expect(page.locator('.contato-logo img')).toHaveAttribute('src', /simbolo-negativa.*\.svg$/);
  await expect(page.locator('.site-header img.brand__logo')).toHaveAttribute('alt', 'Southia');
});

test('brand symbols never rotate (manual: "não girar")', async ({ page }) => {
  await page.goto('/');
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1200);
  const rotor = await page.locator('.hero__rotor').evaluate((e) => getComputedStyle(e).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(rotor);
  await page.locator('#contato').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  const logo = await page.locator('.contato-logo img').evaluate((e) => getComputedStyle(e).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(logo);
});

test('each hero film stop shows its overlay', async ({ page }) => {
  await page.route('**/media/film/**', (r) => r.fulfill({ path: `tests/fixtures/tiny.${new URL(r.request().url()).pathname.split('.').pop()}` }));
  await page.goto('/?debug&filmspeed=3');
  for (const kind of ['chat', 'instagram', 'dados', 'headline']) {
    await expect(page.locator(`.overlay--${kind}`)).toBeVisible({ timeout: 20000 });
  }
  await expect(page.locator('.overlay--instagram')).toContainText('Campanha criada automaticamente');
  await expect(page.locator('.overlay--dados')).toContainText('Atualizado agora');
});

const routeFilm = (page, id, seen = []) => page.route(`**/media/films/${id}.*`, (r) => {
  seen.push(r.request().url());
  const ext = new URL(r.request().url()).pathname.split('.').pop();
  return ext === 'vtt' ? r.fulfill({ status: 404 }) : r.fulfill({ path: `tests/fixtures/tiny.${ext}` });
});

test('film section stays hidden while no film exists', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('#filmes')).toBeHidden();
});

test('film card appears when its poster exists and plays in a dialog', async ({ page }) => {
  const seen = [];
  await routeFilm(page, 'film-2', seen);
  await page.goto('/');
  const card = page.locator('.film-card[data-film="film-2"]');
  await expect(page.locator('#filmes')).toBeVisible({ timeout: 5000 });
  await expect(card).toBeVisible();
  await expect(page.locator('.film-card[data-film="film-3"]')).toBeHidden();
  expect(seen.some((u) => /\.(mp4|webm)$/.test(u))).toBe(false);

  await card.click();
  const dialog = page.locator('dialog.film-player');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog.locator('video')).toHaveAttribute('src', /film-2\.(webm|mp4)$/);
  await expect(dialog.locator('.film-player__close')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(card).toBeFocused();
});

test('hero headline and lead are visible from the first paint (LCP)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' });
  await page.waitForSelector('.hero__lead', { state: 'attached' });
  await page.waitForTimeout(150);
  for (const sel of ['.hero__title', '.hero__lead']) {
    const [vis, op] = await page.locator(sel).evaluate((e) => [getComputedStyle(e).visibility, getComputedStyle(e).opacity]);
    expect(vis).toBe('visible');
    expect(op).toBe('1');
  }
});

test('first paint happens before the motion code runs', async ({ page }) => {
  await page.addInitScript(() => {
    window.__marks = {};
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.name === 'first-contentful-paint') window.__marks.fcp = e.startTime; }))
      .observe({ type: 'paint', buffered: true });
    addEventListener('southia:motion-ready', () => { window.__marks.motion = performance.now(); });
  });
  await page.goto('/');
  await page.waitForFunction(() => window.__marks.fcp && window.__marks.motion, null, { timeout: 8000 });
  const { fcp, motion } = await page.evaluate(() => window.__marks);
  expect(motion).toBeGreaterThan(fcp);
});

test('initial HTML has no video elements (they are created on demand)', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto('/');
  await expect(page.locator('video:not(.film-player__video)')).toHaveCount(0);
});
