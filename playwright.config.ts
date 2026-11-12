import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  // One baseline per platform-independent name; baselines are only ever generated in Docker (pnpm test:visual:update).
  snapshotPathTemplate: "{testDir}/{testFileDir}/__screenshots__/{testFileName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Dev mode serves MSW mocks (VITE_ENABLE_MOCKS in .env.development), so E2E needs no backend.
    command: `pnpm exec vite --port ${PORT} --strictPort --host 0.0.0.0`,
    // E2E stays on plain localhost (no certificates or /etc/hosts entries needed in CI).
    env: { GLIFIC_LOCALHOST: "1" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
