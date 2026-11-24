import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { MOCK_OTP } from "@/mocks/auth";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

describe("ForgotPasswordPage", () => {
  it("sends a WhatsApp code, then saves the new password and returns to log in", async () => {
    const sent: unknown[] = [];
    worker.use(
      http.post("*/api/v1/registration/send-otp", async ({ request }) => {
        sent.push(await request.json());
        return HttpResponse.json({ data: { message: "If you have an account, you will receive an OTP to confirm" } });
      }),
    );
    const { router } = renderRoute("/forgot-password", { signedIn: false });
    expect(await screen.findByRole("heading", { level: 1, name: "Reset your password" })).toBeVisible();
    await expectNoA11yViolations();
    await userEvent.fill(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await userEvent.click(screen.getByRole("button", { name: "Send code" }));

    expect(await screen.findByText("If 919876543210 has an account, a code is on its way on WhatsApp.")).toBeVisible();
    expect(sent).toEqual([{ user: { phone: "919876543210", registration: "false" } }]);
    expect(screen.getByRole("button", { name: /Send a new code in/ })).toBeDisabled();

    await userEvent.fill(screen.getByLabelText("Verification code"), MOCK_OTP);
    await userEvent.fill(screen.getByLabelText("New password"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Save password" }));
    expect(await screen.findByText("Password must be at least 10 characters long.")).toBeVisible();

    await userEvent.fill(screen.getByLabelText("New password"), "Glific@2026x");
    await userEvent.click(screen.getByRole("button", { name: "Save password" }));
    await expect.poll(() => router.state.location.pathname).toBe("/login");
    expect(await screen.findByText("Your password has been changed. Log in with the new one.")).toBeVisible();
  });

  it("explains a wrong code, and shows the rate limit message", async () => {
    renderRoute("/forgot-password", { signedIn: false });
    await userEvent.fill(await screen.findByLabelText("Phone number"), "919876543210");
    await userEvent.click(screen.getByRole("button", { name: "Send code" }));
    await userEvent.fill(await screen.findByLabelText("Verification code"), "000000");
    await userEvent.fill(screen.getByLabelText("New password"), "Glific@2026x");
    await userEvent.click(screen.getByRole("button", { name: "Save password" }));
    expect((await screen.findByRole("alert")).textContent).toContain("please enter the correct OTP");

    worker.use(
      http.post(
        "*/api/v1/registration/send-otp",
        () => new HttpResponse("An OTP was just sent. Please try again in 30 seconds.", { status: 429 }),
      ),
    );
    await userEvent.click(screen.getByRole("button", { name: "Use a different number" }));
    await userEvent.fill(await screen.findByLabelText("Phone number"), "919876543210");
    await userEvent.click(screen.getByRole("button", { name: "Send code" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Please try again in 30 seconds.");
  });
});
