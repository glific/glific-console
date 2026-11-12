/// <reference types="vitest/config" />
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, loadEnv, type ServerOptions } from "vite";
import { parseEnv } from "./src/lib/env.ts";

/**
 * `pnpm dev` serves https://glific.test:3000 like the current app, so cookies, CORS and the backend's websocket
 * origin check behave as they do in production. It reuses the backend's mkcert certificate (glific/priv/cert),
 * which covers glific.test and api.glific.test. Tests and Playwright keep plain localhost.
 */
function glificDevServer(): ServerOptions {
  const certDir = resolve(process.env.GLIFIC_CERT_DIR ?? "../glific/priv/cert");
  const cert = resolve(certDir, "glific.test+1.pem");
  const key = resolve(certDir, "glific.test+1-key.pem");
  const https = existsSync(cert) && existsSync(key) ? { cert: readFileSync(cert), key: readFileSync(key) } : undefined;
  // 3000 matches the backend's websocket origin check (REQUEST_ORIGIN); override to run beside the current app.
  const port = Number(process.env.GLIFIC_DEV_PORT ?? 3000);
  const url = `${https ? "https" : "http"}://glific.test:${port}/`;
  if (!https) console.warn(`[glific] No certificate in ${certDir}; serving ${url} over http.`);
  return {
    host: "glific.test",
    port,
    strictPort: true,
    ...(https ? { https } : {}),
    open: process.env.CI ? false : url,
  };
}

export default defineConfig(({ command, mode }) => {
  // Fail fast at dev/build start rather than at the first API call.
  parseEnv(loadEnv(mode, process.cwd(), "VITE_"));
  const localDev = command === "serve" && !process.env.VITEST && process.env.GLIFIC_LOCALHOST !== "1";

  return {
    plugins: [react(), tailwindcss()],
    ...(localDev ? { server: glificDevServer() } : {}),
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    // The manifest records the import graph; .size-limit.js reads it to budget the initial load and lazy SDKs.
    build: { target: "es2023", manifest: true },
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
        "msw/graphql",
        "graphql-ws",
        "@sentry/react",
        "posthog-js",
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
