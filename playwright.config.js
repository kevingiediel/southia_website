import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.js',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173', ...devices['Desktop Chrome'] },
  webServer: {
    // Tests reference every media slot (files are stubbed per test).
    command: 'npm run build && npm run preview',
    env: { SOUTHIA_ALL_MEDIA: '1' },
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
