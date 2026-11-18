import { describe, expect, it } from "vitest";
import { admins, canAccess, everyone, hasRole, managers, roleKinds } from "./current-user";

describe("hasRole", () => {
  it("matches the backend's role labels regardless of case and spacing", () => {
    expect(hasRole(["Staff", "Glific_admin"], "glific_admin")).toBe(true);
    expect(hasRole(["Glific admin"], "glific_admin")).toBe(true);
    expect(hasRole(["Admin"], "glific_admin")).toBe(false);
    expect(hasRole(["Admin"], "admin")).toBe(true);
    expect(hasRole(null, "staff")).toBe(false);
  });
});

describe("canAccess", () => {
  it("treats roles an organisation created as custom, and No access as no role", () => {
    expect(roleKinds(["Staff", "Content editor", "No access", "none"])).toEqual(["staff", "custom"]);
  });

  it("opens manager pages to custom roles but not to staff, like the current app", () => {
    expect(canAccess(["Content editor"], managers)).toBe(true);
    expect(canAccess(["Staff"], managers)).toBe(false);
    expect(canAccess(["Manager"], admins)).toBe(false);
    expect(canAccess(["Glific_admin"], admins)).toBe(true);
    expect(canAccess(["No access"], everyone)).toBe(false);
    expect(canAccess(null, everyone)).toBe(false);
  });
});
