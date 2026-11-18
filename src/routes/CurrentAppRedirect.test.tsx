import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { browser } from "@/lib/browser";
import { renderRoute } from "@/test/render";

const currentApp = vi.hoisted(() => ({ origin: "https://prod.glific.test" }));

vi.mock("@/lib/backend", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/backend")>()),
  currentAppUrl: (path: string) => `${currentApp.origin}${path}`,
}));

afterEach(() => {
  vi.restoreAllMocks();
  currentApp.origin = "https://prod.glific.test";
});

describe("old addresses", () => {
  it("forwards pages not rebuilt yet to the same page in the current app", async () => {
    const open = vi.spyOn(browser, "open").mockImplementation(() => {});
    renderRoute("/flow/12/edit?tab=settings");
    await expect.poll(() => open.mock.calls[0]?.[0]).toBe("https://prod.glific.test/flow/12/edit?tab=settings");
    expect(await screen.findByText("Opening this page in the current Glific")).toBeVisible();
  });

  it("shows not found instead of looping when this is the only app", async () => {
    currentApp.origin = location.origin;
    const open = vi.spyOn(browser, "open").mockImplementation(() => {});
    renderRoute("/chat");
    expect(await screen.findByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    expect(open).not.toHaveBeenCalled();
  });
});
