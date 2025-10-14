// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory where test files are located */
  testDir: './tests',

  /* TestMonitor reporter configuration */
  reporter: [
    [
      "@testmonitor/playwright-reporter",
      {
        // REPLACE: Your TestMonitor domain (e.g., "mycompany.testmonitor.com")
        domain: "example.testmonitor.com",
        // REPLACE: Your TestMonitor integration token (found in Project Settings > Integrations > Playwright)
        token: "your-token-here"
      }
    ],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
