/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, loadEnv } from "vite";
import { parseEnv } from "./src/lib/env.ts";

export default defineConfig(({ mode }) => {
  // Fail fast at dev/build start rather than at the first API call.
  parseEnv(loadEnv(mode, process.cwd(), "VITE_"));

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: { target: "es2023" },
    // Pre-bundle so Vitest never re-optimises mid-run (which loads a second React and breaks hooks).
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-router",
        "react-router/dom",
        "react-i18next",
        "i18next",
        "@tanstack/react-query",
        "class-variance-authority",
        "cn",
        "cn/config",
        "@tanstack/react-table",
        "cmdk",
        "date-fns",
        "frimousse",
        "react-day-picker",
        "recharts",
        "radix-ui",
        "lucide-react",
        "sonner",
        "msw",
        "msw/browser",
        "axe-core",
        "@testing-library/react",
      ],
    },
    test: {
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["src/test/setup.ts"],
      restoreMocks: true,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: "chromium" }],
        viewport: { width: 1280, height: 800 },
        screenshotFailures: false,
      },
      coverage: {
        provider: "v8",
        include: ["src/components/**/*.tsx", "src/features/**/*.tsx", "src/lib/**/*.{ts,tsx}"],
        exclude: ["**/*.test.*", "**/__ds-lint-fixtures__/**"],
        reporter: ["text-summary", "html", "lcov"],
        thresholds: {
          "src/components/**": { statements: 80, branches: 80, functions: 80, lines: 80 },
        },
      },
    },
  };
});
