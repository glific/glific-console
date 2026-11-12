import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { DatePicker } from "./date-picker";

function Harness() {
  const [value, setValue] = useState<Date | undefined>(new Date(2026, 10, 12));
  return <DatePicker aria-label="Send on" value={value} onValueChange={setValue} fromDate={new Date(2026, 10, 10)} />;
}

describe("DatePicker", () => {
  it("opens a calendar from the keyboard and picks a date", async () => {
    renderWithProviders(<Harness />);
    const trigger = screen.getByRole("button", { name: /^Send on:/ });
    expect(trigger.textContent).toContain("12 Nov 2026");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog");
    await expectNoA11yViolations(dialog);
    await userEvent.keyboard("{ArrowRight}{Enter}");
    await expect.poll(() => trigger.textContent).toContain("13 Nov 2026");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows a placeholder when empty", () => {
    renderWithProviders(<DatePicker aria-label="Date" value={undefined} onValueChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^Date:/ }).textContent).toContain("Pick a date");
  });
});
