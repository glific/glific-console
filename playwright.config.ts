import { defineConfig, devices } from "@playwright/test";

// The backend accepts requests only from this origin.
const BASE_URL = "https://glific.test:3000";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm exec vite",
    // Not a console.* host, so say where the current app is; links to pages not rebuilt yet point there.
    env: { BROWSER: "none", VITE_CURRENT_APP_URL: "https://current.glific.test" },
    url: BASE_URL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
