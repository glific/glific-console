import { describe, expect, it, vi } from "vitest";
import { safeStorage } from "./storage";

describe("safeStorage", () => {
  it("round-trips values", () => {
    safeStorage.set("test-key", "v");
    expect(safeStorage.get("test-key")).toBe("v");
    localStorage.removeItem("test-key");
  });

  it("swallows storage errors", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(safeStorage.get("x")).toBeNull();
    expect(() => safeStorage.set("x", "y")).not.toThrow();
  });
});
