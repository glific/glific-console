import { describe, expect, it } from "vitest";
import { hasRole } from "./current-user";

describe("hasRole", () => {
  it("matches the backend's role labels regardless of case and spacing", () => {
    expect(hasRole(["Staff", "Glific_admin"], "glific_admin")).toBe(true);
    expect(hasRole(["Glific admin"], "glific_admin")).toBe(true);
    expect(hasRole(["Admin"], "glific_admin")).toBe(false);
    expect(hasRole(["Admin"], "admin")).toBe(true);
    expect(hasRole(null, "staff")).toBe(false);
  });
});
