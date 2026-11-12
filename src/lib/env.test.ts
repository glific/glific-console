import { describe, expect, it } from "vitest";
import { EnvError, parseEnv } from "./env";

describe("parseEnv", () => {
  it("parses a valid environment", () => {
    expect(parseEnv({ VITE_API_URL: " /api ", VITE_ENABLE_MOCKS: "true" })).toEqual({
      VITE_API_URL: "/api",
      VITE_ENABLE_MOCKS: true,
    });
    expect(parseEnv({ VITE_API_URL: "/api" }).VITE_ENABLE_MOCKS).toBe(false);
  });

  it("fails fast listing every problem", () => {
    expect(() => parseEnv({ VITE_ENABLE_MOCKS: "yes" })).toThrowError(EnvError);
    expect(() => parseEnv({ VITE_ENABLE_MOCKS: "yes" })).toThrowError(
      /VITE_API_URL is required[\s\S]*VITE_ENABLE_MOCKS must be "true" or "false"/,
    );
  });
});
