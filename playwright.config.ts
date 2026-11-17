import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "https://glific.test:3000";
const isCI = Boolean(process.env.CI);

/**
 * E2E runs the real app against a real Glific backend loaded with the dev seeds (`mix setup`), on
 * https://glific.test:3000 because that is the origin the backend accepts. Locally it reuses `pnpm dev` if running.
 */
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
    env: { BROWSER: "none" },
    url: BASE_URL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
