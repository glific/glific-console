import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./app-providers";
import { env } from "./lib/config";
import { createRouter } from "./routes/router";
import "./index.css";

async function enableMocking() {
  if (!env.VITE_ENABLE_MOCKS) return;
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
