import { afterEach, describe, expect, it, vi } from "vitest";
import { monitoringReady, reportError, startMonitoring, track } from "./monitoring";

const sentry = { init: vi.fn(), setTag: vi.fn(), captureException: vi.fn() };
const posthog = { init: vi.fn(), register: vi.fn(), capture: vi.fn() };
const load = {
  sentry: async () => sentry as never,
  posthog: async () => posthog as never,
};
const off = { VITE_SENTRY_DSN: null, VITE_POSTHOG_KEY: null, VITE_POSTHOG_HOST: "https://us.i.posthog.com" };

afterEach(() => {
  for (const fn of [...Object.values(sentry), ...Object.values(posthog)]) fn.mockClear();
});

describe("monitoring", () => {
  it("stays off without keys", async () => {
    startMonitoring(off, load);
    reportError(new Error("boom"));
    track("signed_in");
    await monitoringReady();
    expect(sentry.init).not.toHaveBeenCalled();
    expect(posthog.init).not.toHaveBeenCalled();
  });

  it("starts Sentry and PostHog with the host tag and forwards errors and events", async () => {
    startMonitoring({ ...off, VITE_SENTRY_DSN: "https://key@sentry.io/1", VITE_POSTHOG_KEY: "phc_1" }, load);
    await monitoringReady();
    expect(sentry.init).toHaveBeenCalledWith(expect.objectContaining({ dsn: "https://key@sentry.io/1" }));
    expect(sentry.setTag).toHaveBeenCalledWith("host", location.hostname);
    expect(posthog.init).toHaveBeenCalledWith(
      "phc_1",
      expect.objectContaining({ api_host: "https://us.i.posthog.com" }),
    );
    expect(posthog.register).toHaveBeenCalledWith({ host: location.hostname });

    const error = new Error("boom");
    reportError(error, { source: "test" });
    track("signed_in", { method: "password" });
    await expect.poll(() => sentry.captureException.mock.calls.length).toBe(1);
    expect(sentry.captureException).toHaveBeenCalledWith(error, { extra: { source: "test" } });
    await expect.poll(() => posthog.capture.mock.calls.length).toBe(1);
    expect(posthog.capture).toHaveBeenCalledWith("signed_in", { method: "password" });
  });
});
