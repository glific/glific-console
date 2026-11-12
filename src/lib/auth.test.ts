import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { mockSession } from "@/mocks/auth";
import { worker } from "@/test/msw";
import { apiClient } from "./api-client";
import { accessToken, renewSession } from "./auth";
import { backendOrigin } from "./backend";
import { getSession, needsRenewal, SESSION_KEY, setSession } from "./session";

describe("session", () => {
  it("ignores missing or malformed sessions and merges updates", () => {
    expect(getSession()).toBeNull();
    localStorage.setItem(SESSION_KEY, "{not json");
    expect(getSession()).toBeNull();
    localStorage.setItem(SESSION_KEY, JSON.stringify({ access_token: "a" }));
    expect(getSession()).toBeNull();
    setSession(mockSession());
    setSession({ is_trial: true });
    expect(getSession()?.is_trial).toBe(true);
    expect(getSession()?.access_token).toMatch(/^access-/);
  });

  it("renews 30 seconds before expiry", () => {
    const now = Date.now();
    expect(needsRenewal(mockSession(60_000), now)).toBe(false);
    expect(needsRenewal(mockSession(20_000), now)).toBe(true);
  });
});

describe("auth", () => {
  it("returns null when signed out and the stored token when fresh", async () => {
    expect(await accessToken()).toBeNull();
    setSession(mockSession());
    expect(await accessToken()).toBe(getSession()?.access_token);
  });

  it("renews an expiring token once for concurrent callers", async () => {
    const renew = vi.fn();
    worker.use(
      http.post("*/api/v1/session/renew", () => {
        renew();
        return HttpResponse.json({ data: { ...mockSession(), access_token: "access-renewed" } });
      }),
    );
    setSession(mockSession(1_000));
    const tokens = await Promise.all([accessToken(), accessToken(), accessToken()]);
    expect(tokens).toEqual(["access-renewed", "access-renewed", "access-renewed"]);
    expect(renew).toHaveBeenCalledOnce();
  });

  it("signs out when renewal is rejected", async () => {
    worker.use(http.post("*/api/v1/session/renew", () => HttpResponse.json({ error: {} }, { status: 401 })));
    setSession(mockSession(1_000));
    expect(await accessToken()).toBeNull();
    expect(getSession()).toBeNull();
    await expect(renewSession()).rejects.toThrow("Not signed in");
  });
});

describe("apiClient", () => {
  it("sends the access token and signs out on 401", async () => {
    let authorization: string | null = null;
    worker.use(
      http.get("*/api/probe", ({ request }) => {
        authorization = request.headers.get("authorization");
        return HttpResponse.json({ ok: true });
      }),
    );
    setSession(mockSession());
    await expect(apiClient.get("/probe")).resolves.toEqual({ ok: true });
    expect(authorization).toBe(getSession()?.access_token);

    worker.use(http.get("*/api/probe", () => HttpResponse.json({ error: "expired" }, { status: 401 })));
    await expect(apiClient.get("/probe")).rejects.toMatchObject({ status: 401 });
    expect(getSession()).toBeNull();
  });
});

describe("backendOrigin", () => {
  const overrides = {
    VITE_BACKEND_URL: null,
    VITE_API_SUBDOMAIN: "api",
    VITE_ENABLE_MOCKS: false,
    VITE_DESIGN_SYSTEM_HOSTS: [],
    VITE_SENTRY_DSN: null,
    VITE_POSTHOG_KEY: null,
    VITE_POSTHOG_HOST: "https://us.i.posthog.com",
  };
  const place = (url: string) => {
    const u = new URL(url);
    return { protocol: u.protocol, hostname: u.hostname, host: u.host, origin: u.origin };
  };

  it("uses api.<host> for NGO subdomains, the page origin locally, and the override when set", () => {
    expect(backendOrigin(place("https://pratham.glific.com/chats"), overrides)).toBe("https://api.pratham.glific.com");
    expect(backendOrigin(place("http://localhost:5173/"), overrides)).toBe("http://localhost:5173");
    expect(
      backendOrigin(place("https://pratham.glific.com/"), {
        ...overrides,
        VITE_BACKEND_URL: "https://api.glific.test:4001",
      }),
    ).toBe("https://api.glific.test:4001");
  });
});
