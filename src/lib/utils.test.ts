import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps a typography step and a text colour together", () => {
    expect(cn("text-body text-muted-foreground")).toBe("text-body text-muted-foreground");
  });

  it("lets later typography and spacing tokens win", () => {
    expect(cn("text-body", "text-title")).toBe("text-title");
    expect(cn("p-4", "p-page")).toBe("p-page");
    expect(cn("gap-stack", false && "hidden", "gap-section")).toBe("gap-section");
  });
});
