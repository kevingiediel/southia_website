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
