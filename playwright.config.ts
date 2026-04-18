import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
    // Disable CSS animations so axe contrast checks don't race against
    // opacity fade-ins (our global.css already hides animations under
    // prefers-reduced-motion: reduce).
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
