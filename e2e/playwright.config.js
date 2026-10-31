const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:2222';
const browserChannel = process.env.PLAYWRIGHT_CHANNEL || undefined;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45 * 1000,
  expect: {
    timeout: 12 * 1000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI
    ? [
        ['list'],
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }]
      ]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }]
      ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        ...(browserChannel ? { channel: browserChannel } : {})
      }
    }
  ]
});
