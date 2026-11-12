import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./app-providers";
import { env } from "./lib/config";
import { startMonitoring } from "./lib/monitoring";
import { createRouter } from "./routes/router";
import "./index.css";

async function enableMocking() {
  // The DEV check lets the bundler drop MSW from production builds entirely.
  if (!import.meta.env.DEV || !env.VITE_ENABLE_MOCKS) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledFrame: "bypass", quiet: true });
}

await enableMocking();

const router = createRouter();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);

const idle = globalThis.requestIdleCallback ?? ((callback: () => void) => setTimeout(callback, 1));
idle(() => startMonitoring());
