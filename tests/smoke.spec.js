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
