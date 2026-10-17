import { test, expect } from '@playwright/test';

test('content renders with JavaScript disabled', async ({ browser }) => {
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Pessoas, dados e IA na mesma roda.');
  await expect(page.locator('.card h3')).toHaveCount(6);
  await expect(page.locator('.card h3').first()).toBeVisible();
  for (const id of ['topo', 'solucoes', 'como', 'contato']) await expect(page.locator(`#${id}`)).toHaveCount(1);
});
