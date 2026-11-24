import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { browser } from "@/lib/browser";
import { MOCK_OTP } from "@/mocks/auth";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

async function fillAccount() {
  await userEvent.fill(await screen.findByLabelText("Name"), "Asha Verma");
  await userEvent.fill(screen.getByLabelText("Work email"), "asha@saarthi.org");
  await userEvent.fill(screen.getByLabelText("Number"), "+91 98765 43210");
  await userEvent.fill(screen.getByLabelText("Password"), "Glific@2026x");
  await userEvent.click(screen.getByRole("button", { name: "Start 14-day trial" }));
  await userEvent.fill(await screen.findByLabelText("Organisation name"), "Saarthi Learning");
  await userEvent.click(screen.getByRole("button", { name: "Continue" }));
}

afterEach(() => vi.restoreAllMocks());

describe("TrialSignUpPage", () => {
  it("collects the account and organisation, confirms the emailed code and opens the trial's login", async () => {
    let started: unknown;
    worker.use(
      http.post("*/api/v1/trial/create-trial-user", async ({ request }) => {
        started = await request.json();
        return HttpResponse.json({ data: { message: "OTP sent" } });
      }),
    );
    const open = vi.spyOn(browser, "open").mockImplementation(() => {});
    renderRoute("/trial", { signedIn: false });
    expect(await screen.findByRole("heading", { level: 1, name: "Create your account" })).toBeVisible();
    await expectNoA11yViolations();
    await fillAccount();

    expect(await screen.findByText("Enter the code we sent to asha@saarthi.org.")).toBeVisible();
    expect(started).toEqual({
      username: "Asha Verma",
      email: "asha@saarthi.org",
      phone: "919876543210",
      organization_name: "Saarthi Learning",
      password: "Glific@2026x",
    });
    await userEvent.fill(screen.getByLabelText("Verification code"), MOCK_OTP);
    await userEvent.click(screen.getByRole("button", { name: "Verify and start trial" }));
    await expect.poll(() => open.mock.calls[0]?.[0]).toBe("https://trial1.glific.test/login");
  });

  it("shows the backend's message when no trial account is free", async () => {
    worker.use(
      http.post("*/api/v1/trial/allocate-account", () =>
        HttpResponse.json({
          success: false,
          error: "Apologies, at the moment, all our trial accounts are currently in use.",
        }),
      ),
    );
    renderRoute("/trial", { signedIn: false });
    await fillAccount();
    await userEvent.fill(await screen.findByLabelText("Verification code"), MOCK_OTP);
    await userEvent.click(screen.getByRole("button", { name: "Verify and start trial" }));
    expect((await screen.findByRole("alert")).textContent).toContain("all our trial accounts are currently in use");
  });
});
