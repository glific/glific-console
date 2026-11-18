import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { currentUserWithRoles } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

async function openAccountMenu() {
  await userEvent.click(await screen.findByRole("button", { name: /account and settings/ }));
  return screen.findByRole("menu");
}

describe("account menu", () => {
  it("offers my account, settings, the Glific admin pages and sign out to a Glific admin", async () => {
    renderRoute("/");
    const menu = await openAccountMenu();
    expect(screen.getByRole("menuitem", { name: "My account" })).toHaveAttribute(
      "href",
      `${location.origin}/myaccount`,
    );
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute("href", `${location.origin}/settings`);
    expect(screen.getByRole("menuitem", { name: "Organizations" })).toHaveAttribute(
      "href",
      `${location.origin}/organizations`,
    );
    expect(screen.getByRole("menuitem", { name: "Design system" })).toHaveAttribute("href", "/design-system");
    expect(screen.getByRole("menuitem", { name: "Log out" })).toBeVisible();
    // The open menu aria-hides the page behind it, so check the menu on its own.
    await expectNoA11yViolations(menu);
  });

  it("sends managers to the first settings page they can open, and hides Glific admin pages", async () => {
    worker.use(currentUserWithRoles(["Manager"]));
    renderRoute("/");
    await openAccountMenu();
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute(
      "href",
      `${location.origin}/staff-management`,
    );
    expect(screen.queryByRole("menuitem", { name: "Organizations" })).toBeNull();
  });

  it("has no settings for staff", async () => {
    worker.use(currentUserWithRoles(["Staff"]));
    renderRoute("/");
    await openAccountMenu();
    expect(screen.getByRole("menuitem", { name: "My account" })).toBeVisible();
    expect(screen.queryByRole("menuitem", { name: "Settings" })).toBeNull();
  });
});
