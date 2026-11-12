import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { StatusDot } from "./status-dot";

describe("StatusDot", () => {
  it("is announced when labelled and decorative otherwise, in every tone", async () => {
    renderWithProviders(
      <>
        {(["neutral", "success", "warning", "danger", "info", "ai", "live"] as const).map((tone) => (
          <StatusDot key={tone} tone={tone} label={tone} />
        ))}
        <StatusDot tone="success" pulse data-testid="decorative" />
      </>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(7);
    expect(screen.getByRole("img", { name: "danger" }).className).toContain("bg-destructive");
    expect(screen.getByTestId("decorative")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("decorative").className).toContain("animate-pulse");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
