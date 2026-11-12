import { describe, expect, it } from "vitest";
import { EnvError, parseEnv } from "./env";

describe("parseEnv", () => {
  it("applies defaults and parses values", () => {
    expect(parseEnv({})).toEqual({
      VITE_BACKEND_URL: null,
      VITE_API_SUBDOMAIN: "api",
      VITE_ENABLE_MOCKS: false,
      VITE_DESIGN_SYSTEM_HOSTS: [],
      VITE_SENTRY_DSN: null,
      VITE_POSTHOG_KEY: null,
      VITE_POSTHOG_HOST: "https://us.i.posthog.com",
    });
    const env = parseEnv({
      VITE_BACKEND_URL: "https://api.glific.test:4001/",
      VITE_ENABLE_MOCKS: "true",
      VITE_POSTHOG_KEY: " phc_123 ",
    });
    expect(env.VITE_BACKEND_URL).toBe("https://api.glific.test:4001");
    expect(env.VITE_ENABLE_MOCKS).toBe(true);
    expect(env.VITE_POSTHOG_KEY).toBe("phc_123");
  });

  it("fails fast listing every problem", () => {
    expect(() => parseEnv({ VITE_ENABLE_MOCKS: "yes", VITE_BACKEND_URL: "not a url" })).toThrowError(EnvError);
    expect(() => parseEnv({ VITE_ENABLE_MOCKS: "yes", VITE_BACKEND_URL: "not a url" })).toThrowError(
      /VITE_BACKEND_URL must be an absolute URL[\s\S]*VITE_ENABLE_MOCKS must be "true" or "false"/,
    );
  });
});
