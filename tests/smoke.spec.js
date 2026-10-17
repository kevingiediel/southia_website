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
