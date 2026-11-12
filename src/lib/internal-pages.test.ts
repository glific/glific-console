import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";
import { internalPagesEnabled } from "./internal-pages";

describe("internalPagesEnabled", () => {
  const allowed = parseEnv({
    VITE_API_URL: "/api",
    VITE_DESIGN_SYSTEM_HOSTS: " prod.glific.com , localhost",
  }).VITE_DESIGN_SYSTEM_HOSTS;

  it("allows only the listed hosts", () => {
    expect(allowed).toEqual(["prod.glific.com", "localhost"]);
    expect(internalPagesEnabled("prod.glific.com", allowed)).toBe(true);
    expect(internalPagesEnabled("PROD.glific.com", allowed)).toBe(true);
    expect(internalPagesEnabled("pratham.glific.com", allowed)).toBe(false);
    expect(internalPagesEnabled("prod.glific.com.evil.org", allowed)).toBe(false);
  });

  it("is off everywhere when no hosts are configured", () => {
    const none = parseEnv({ VITE_API_URL: "/api" }).VITE_DESIGN_SYSTEM_HOSTS;
    expect(none).toEqual([]);
    expect(internalPagesEnabled("prod.glific.com", none)).toBe(false);
  });
});
