import { screen } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { glificApi } from "@/mocks/handlers";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

describe("router", () => {
  it("renders the layout with navigation and moves between pages", async () => {
    const { router } = renderRoute("/");
    expect(await screen.findByRole("heading", { level: 1, name: "Home" })).toBeVisible();
    await userEvent.click(screen.getByRole("link", { name: "Contacts" }));
    await expect.poll(() => router.state.location.pathname).toBe("/contacts");
    await expect.element(screen.getByRole("link", { name: "Contacts" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the 404 page for unknown paths", async () => {
    renderRoute("/does-not-exist");
    expect(await screen.findByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go to home" })).toHaveAttribute("href", "/");
  });

  it("serves /design-system to Glific admins", async () => {
    renderRoute("/design-system");
    expect(await screen.findByRole("heading", { level: 1, name: "Design system" }, { timeout: 5000 })).toBeVisible();
    expect(screen.getByRole("link", { name: "Design system" })).toHaveAttribute("aria-current", "page");
  });

  it("hides /design-system from users who are not Glific admins", async () => {
    worker.use(
      glificApi.query("CurrentUser", () =>
        HttpResponse.json({ data: { currentUser: { user: { id: "2", name: "NGO admin", roles: ["Admin"] } } } }),
      ),
    );
    renderRoute("/design-system");
    expect(await screen.findByRole("heading", { level: 1, name: "Page not found" }, { timeout: 5000 })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Design system" })).toBeNull();
  });
});
