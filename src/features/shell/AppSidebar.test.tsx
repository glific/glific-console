import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { currentUserWithRoles } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

const rail = () => screen.findByRole("navigation", { name: "Main" });

describe("side rail", () => {
  it("shows every section to a Glific admin, linking unbuilt ones to the current app", async () => {
    renderRoute("/");
    const nav = await rail();
    const links = await within(nav).findAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Home",
      "Chats",
      "Flows",
      "Library",
      "AI assistants",
      "Analytics",
      "Contacts",
    ]);
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Contacts" })).toHaveAttribute("href", "/contacts");
    expect(within(nav).getByRole("link", { name: "Flows" })).toHaveAttribute("href", `${location.origin}/flow`);
    expect(within(nav).getByRole("link", { name: "Library" })).toHaveAttribute(
      "href",
      `${location.origin}/interactive-message`,
    );
    await expectNoA11yViolations();
  });

  it("shows staff only the sections the current app gives them", async () => {
    worker.use(currentUserWithRoles(["Staff"]));
    renderRoute("/");
    const nav = await rail();
    await within(nav).findByRole("link", { name: "Chats" });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Home", "Chats", "Analytics", "Contacts"]);
  });

  it("treats a custom role like a manager", async () => {
    worker.use(currentUserWithRoles(["Counsellor"]));
    renderRoute("/");
    const nav = await rail();
    expect(await within(nav).findByRole("link", { name: "Flows" })).toBeVisible();
  });

  it("folds to icons and remembers it", async () => {
    renderRoute("/");
    await rail();
    await userEvent.click(screen.getByRole("button", { name: "Collapse or expand the menu" }));
    expect(localStorage.getItem("glific.rail")).toBe("closed");
    await expect
      .poll(() => document.querySelector("[data-slot=sidebar]")?.getAttribute("data-state"))
      .toBe("collapsed");
  });

  it("shows the WhatsApp wallet balance", async () => {
    renderRoute("/");
    expect(await screen.findByText("$12.50")).toBeVisible();
    expect(screen.getByText("Message balance")).toBeVisible();
  });
});
