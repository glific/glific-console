import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { currentUserWithRoles } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

const strip = () => screen.findByRole("navigation", { name: "Apps" });

describe("right panel", () => {
  it("opens an app from the strip, resizes from the keyboard and closes on Escape", async () => {
    renderRoute("/");
    await userEvent.click(await within(await strip()).findByRole("button", { name: "Resources" }));
    const panel = await screen.findByRole("complementary", { name: "Resources" });
    expect(await within(panel).findByRole("link", { name: /Documentation/ })).toHaveAttribute(
      "href",
      "https://docs.glific.org",
    );
    expect(screen.getByRole("button", { name: "Resources" })).toHaveAttribute("aria-pressed", "true");

    const handle = screen.getByRole("separator", { name: "Resize the panel" });
    expect(handle).toHaveAttribute("aria-valuenow", "460");
    handle.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(handle).toHaveAttribute("aria-valuenow", "476");
    expect(localStorage.getItem("glific.sidePanelWidth")).toBe("476");
    await expectNoA11yViolations();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("complementary", { name: "Resources" })).toBeNull();
  });

  it("links to apps still in the current app and hides apps the user can't use", async () => {
    worker.use(currentUserWithRoles(["Staff"]));
    renderRoute("/contacts");
    const apps = await strip();
    expect(await within(apps).findByRole("button", { name: "Glific AI" })).toBeVisible();
    expect(within(apps).getByRole("link", { name: "Raise a ticket" })).toHaveAttribute(
      "href",
      "https://discord.gg/kyqsZAJEPK",
    );
    expect(within(apps).queryByRole("button", { name: /Notifications/ })).toBeNull();
    expect(within(apps).queryByRole("link", { name: "Webhook logs" })).toBeNull();
  });

  it("shows webhook logs as a link to the current app for managers", async () => {
    renderRoute("/");
    expect(await within(await strip()).findByRole("link", { name: "Webhook logs" })).toHaveAttribute(
      "href",
      "https://current.glific.test/webhook-logs",
    );
  });

  it("leaves Glific AI out of the strip on Home, which has its own Ask box", async () => {
    renderRoute("/");
    const apps = await strip();
    await within(apps).findByRole("button", { name: "Resources" });
    expect(within(apps).queryByRole("button", { name: "Glific AI" })).toBeNull();
  });
});
