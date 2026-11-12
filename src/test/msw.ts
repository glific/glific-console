import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

/** Shared worker for component tests. Override per test with `worker.use(...)`. */
export const worker = setupWorker(...handlers);
