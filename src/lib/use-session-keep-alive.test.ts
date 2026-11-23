import { renderHook } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mockSession } from "@/mocks/auth";
import { worker } from "@/test/msw";
import { getSession, setSession } from "./session";
import { useSessionKeepAlive } from "./use-session-keep-alive";

afterEach(() => {
  vi.useRealTimers();
});

describe("useSessionKeepAlive", () => {
  it("renews shortly before the token expires, without waiting for a request", async () => {
    // The clock moves with the timers (renewal checks the time), and keeps ticking so polling still works.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"], shouldAdvanceTime: true });
    const renew = vi.fn();
    worker.use(
      http.post("*/api/v1/session/renew", () => {
        renew();
        return HttpResponse.json({ data: { ...mockSession(), access_token: "access-kept-alive" } });
      }),
    );
    setSession(mockSession(3 * 60_000));
    renderHook(() => useSessionKeepAlive());
    vi.advanceTimersByTime(59_000);
    expect(renew).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2_000);
    await expect.poll(() => getSession()?.access_token).toBe("access-kept-alive");
    expect(renew).toHaveBeenCalledOnce();
  });

  it("renews when someone comes back to the tab after the token expired", async () => {
    worker.use(
      http.post("*/api/v1/session/renew", () =>
        HttpResponse.json({ data: { ...mockSession(), access_token: "access-on-return" } }),
      ),
    );
    setSession(mockSession(-60_000));
    renderHook(() => useSessionKeepAlive());
    document.dispatchEvent(new Event("visibilitychange"));
    await expect.poll(() => getSession()?.access_token).toBe("access-on-return");
  });
});
