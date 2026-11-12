import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ErrorState } from "./error-state";
import { Button } from "./ui/button";

describe("ErrorState", () => {
  it("falls back to translated generic copy and announces itself", async () => {
    renderWithProviders(<ErrorState />);
    expect(screen.getByRole("alert").textContent).toContain("Something went wrong");
    expect(screen.queryByRole("button")).toBeNull();
    await expectNoA11yViolations();
  });

  it("retries from the keyboard and renders extra actions", async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <ErrorState
        title="Couldn't load flows"
        description="Check your connection."
        onRetry={onRetry}
        action={<Button variant="ghost">Contact support</Button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Couldn't load flows" })).toBeVisible();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Try again" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onRetry).toHaveBeenCalledOnce();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Contact support" })).toHaveFocus();
    await expectNoA11yViolations();
  });
});
