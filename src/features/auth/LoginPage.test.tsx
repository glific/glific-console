import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { getSession } from "@/lib/session";
import { currentUserWithRoles } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

async function fillAndSubmit(phone: string, password: string) {
  await userEvent.fill(await screen.findByLabelText("Phone number"), phone);
  await userEvent.fill(screen.getByLabelText("Password"), password);
  await userEvent.keyboard("{Enter}");
}

describe("LoginPage", () => {
  it("guards app routes and returns to the requested page after signing in", async () => {
    const { router } = renderRoute("/contacts", { signedIn: false });
    expect(await screen.findByRole("heading", { level: 1, name: "Log in" })).toBeVisible();
    await expectNoA11yViolations();
    await fillAndSubmit("+91 98765 43210", "password");
    await expect.poll(() => router.state.location.pathname).toBe("/contacts");
    expect(getSession()?.access_token).toMatch(/^access-/);
  });

  it("shows the backend's message for wrong credentials and suspended accounts", async () => {
    renderRoute("/login", { signedIn: false });
    await fillAndSubmit("919876543210", "wrong");
    expect((await screen.findByRole("alert")).textContent).toContain("Invalid phone or password");

    worker.use(
      http.post("*/api/v1/session", () =>
        HttpResponse.json({ error: { status: 403, message: "Your account is suspended." } }, { status: 403 }),
      ),
    );
    await fillAndSubmit("919876543210", "password");
    await expect.poll(() => screen.getByRole("alert").textContent).toContain("Your account is suspended.");
  });

  it("validates empty fields, toggles password visibility and handles network failure", async () => {
    renderRoute("/login", { signedIn: false });
    await userEvent.click(await screen.findByRole("button", { name: "Log in" }));
    expect(await screen.findByText("Enter the number with its country code, e.g. 919876543210")).toBeVisible();
    expect(screen.getByText("Enter your password")).toBeVisible();
    expect(screen.getByLabelText("Phone number")).toHaveAttribute("aria-invalid", "true");

    const password = screen.getByLabelText("Password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");

    worker.use(http.post("*/api/v1/session", () => HttpResponse.error()));
    await fillAndSubmit("919876543210", "password");
    await expect.poll(() => screen.getByRole("alert").textContent).toContain("Couldn't log in");
  });

  it("sends signed-in users away from /login, and signs out", async () => {
    const { router } = renderRoute("/login");
    await expect.poll(() => router.state.location.pathname).toBe("/");
    await userEvent.click(await screen.findByRole("button", { name: /account and settings/ }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Log out" }));
    await expect.poll(() => router.state.location.pathname).toBe("/login");
    expect(getSession()).toBeNull();
  });

  it("turns away accounts an admin hasn't approved yet", async () => {
    worker.use(currentUserWithRoles(["None"]));
    renderRoute("/login", { signedIn: false });
    await fillAndSubmit("919876543210", "password");
    expect((await screen.findByRole("alert")).textContent).toContain("Your account is not approved yet.");
    expect(getSession()).toBeNull();
  });

  it("links to password reset and to creating an account", async () => {
    renderRoute("/login", { signedIn: false });
    expect(await screen.findByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/register");
  });
});
