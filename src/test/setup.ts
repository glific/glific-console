import "@/index.css";
import "@/lib/i18n";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./msw";

// Enter/exit animations make axe measure half-faded colours and slow tests down.
const noMotion = document.createElement("style");
noMotion.textContent = "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}";
document.head.append(noMotion);

beforeAll(() => worker.start({ onUnhandledFrame: "error", quiet: true }));
afterEach(() => {
  cleanup();
  worker.resetHandlers();
  document.documentElement.classList.remove("dark");
});
afterAll(() => worker.stop());
