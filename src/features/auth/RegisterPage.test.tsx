import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { MOCK_OTP } from "@/mocks/auth";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

async function fillDetails() {
  await userEvent.fill(await screen.findByLabelText("Your full name"), "Asha Verma");
  await userEvent.fill(screen.getByLabelText("Email"), "asha@saarthi.org");
  await userEvent.fill(screen.getByLabelText("Phone number"), "919876543210");
  await userEvent.fill(screen.getByLabelText("Password"), "Glific@2026x");
}

describe("RegisterPage", () => {
  it("creates a staff account with the WhatsApp code and says an admin must approve it", async () => {
    let registered: unknown;
    worker.use(
      http.post("*/api/v1/registration", async ({ request }) => {
        registered = await request.json();
        return HttpResponse.json({ data: {} });
      }),
    );
    renderRoute("/register", { signedIn: false });
    expect(await screen.findByRole("heading", { level: 1, name: "Create your account" })).toBeVisible();
    await expectNoA11yViolations();
    await fillDetails();
    await userEvent.click(screen.getByLabelText("I would like to receive product updates"));
    await userEvent.click(screen.getByRole("button", { name: "Send code on WhatsApp" }));

    expect(await screen.findByText("Enter the code we sent to 919876543210.")).toBeVisible();
    await userEvent.fill(screen.getByLabelText("Verification code"), MOCK_OTP);
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Your account is created" })).toBeVisible();
    expect(registered).toEqual({
      user: {
        name: "Asha Verma",
        email: "asha@saarthi.org",
        phone: "919876543210",
        password: "Glific@2026x",
        otp: MOCK_OTP,
        consent_for_updates: true,
      },
    });
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("checks the password rules and shows when the number already has an account", async () => {
    worker.use(
      http.post("*/api/v1/registration/send-otp", () =>
        HttpResponse.json(
          { error: { status: 400, message: "Account with phone number 919876543210 already exists" } },
          { status: 400 },
        ),
      ),
    );
    renderRoute("/register", { signedIn: false });
    await fillDetails();
    await userEvent.fill(screen.getByLabelText("Password"), "alllowercase1!");
    await userEvent.click(screen.getByRole("button", { name: "Send code on WhatsApp" }));
    expect(await screen.findByText(/at least one lowercase letter, one uppercase letter/)).toBeVisible();

    await userEvent.fill(screen.getByLabelText("Password"), "Glific@2026x");
    await userEvent.click(screen.getByRole("button", { name: "Send code on WhatsApp" }));
    expect((await screen.findByRole("alert")).textContent).toContain("already exists");
  });
});
