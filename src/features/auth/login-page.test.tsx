import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { getSession } from "@/lib/session";
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
    expect(await screen.findByRole("heading", { level: 1, name: "Sign in to Glific" })).toBeVisible();
    await expectNoA11yViolations();
    await fillAndSubmit("+91 98765 43210", "password");
    await expect.poll(() => router.state.location.pathname).toBe("/contacts");
    expect(getSession()?.access_token).toMatch(/^access-/);
  });

  it("shows the backend's message for wrong credentials and suspended accounts", async () => {
    renderRoute("/login", { signedIn: false });
    await fillAndSubmit("919876543210", "wrong");
    expect((await screen.findByRole("alert")).textContent).toContain("Invalid phone or password");
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");

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
    await userEvent.click(await screen.findByRole("button", { name: "Sign in" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Enter your phone number and password.");

    const password = screen.getByLabelText("Password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");

    worker.use(http.post("*/api/v1/session", () => HttpResponse.error()));
    await fillAndSubmit("919876543210", "password");
    await expect.poll(() => screen.getByRole("alert").textContent).toContain("Couldn't sign in");
  });

  it("sends signed-in users away from /login, and signs out", async () => {
    const { router } = renderRoute("/login");
    await expect.poll(() => router.state.location.pathname).toBe("/");
    await userEvent.click(await screen.findByRole("link", { name: "Sign out" }));
    await expect.poll(() => router.state.location.pathname).toBe("/login");
    expect(getSession()).toBeNull();
  });
});
