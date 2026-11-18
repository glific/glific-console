import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { setSession } from "@/lib/session";
import { MOCK_PASSWORD, mockSession } from "@/mocks/auth";
import { glificApi } from "@/mocks/handlers";
import { worker } from "@/test/msw";
import { renderRoute, renderWithProviders } from "@/test/render";
import { createRoutes } from "./router";

describe("router", () => {
  it("renders the layout with navigation and moves between pages", async () => {
    const { router } = renderRoute("/");
    expect(await screen.findByRole("heading", { level: 1 })).toBeVisible();
    await userEvent.click(await screen.findByRole("link", { name: "Contacts" }));
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
    await userEvent.click(await screen.findByRole("button", { name: /account and settings/ }));
    expect(await screen.findByRole("menuitem", { name: "Design system" })).toHaveAttribute("aria-current", "page");
  });

  it("hides /design-system from users who are not Glific admins", async () => {
    worker.use(
      glificApi.query("CurrentUser", () =>
        HttpResponse.json({
          data: {
            currentUser: {
              user: { id: "2", name: "NGO admin", accessRoles: [{ label: "Admin" }], organization: { id: "1" } },
            },
          },
        }),
      ),
    );
    renderRoute("/design-system");
    expect(await screen.findByRole("heading", { level: 1, name: "Page not found" }, { timeout: 5000 })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Design system" })).toBeNull();
  });
});

describe("expired session", () => {
  it("sends the user to login when renewal fails, then back to the page they were on", async () => {
    worker.use(http.post("*/api/v1/session/renew", () => HttpResponse.json({ error: {} }, { status: 401 })));
    setSession(mockSession(0));
    const router = createMemoryRouter(createRoutes(), { initialEntries: ["/contacts"] });
    renderWithProviders(<RouterProvider router={router} />);
    await expect.poll(() => router.state.location.pathname, { timeout: 5000 }).toBe("/login");

    await userEvent.fill(screen.getByLabelText("Phone number"), "917834811114");
    await userEvent.fill(screen.getByLabelText("Password", { exact: true }), MOCK_PASSWORD);
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));
    await expect.poll(() => router.state.location.pathname).toBe("/contacts");
  });
});
