import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { HelpTip } from "./help-tip";

describe("HelpTip", () => {
  it("explains a field in a popover opened from the keyboard", async () => {
    renderWithProviders(<HelpTip label="About keywords">Contacts type a keyword to start this flow.</HelpTip>);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const popover = await screen.findByRole("dialog", { name: "About keywords" });
    expect(popover.textContent).toContain("type a keyword");
    await expectNoA11yViolations(popover);
    await userEvent.keyboard("{Escape}");
    await expect.element(screen.getByRole("button", { name: "About keywords" })).toHaveFocus();
  });
});
