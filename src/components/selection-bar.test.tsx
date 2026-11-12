import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { SelectionBar } from "./selection-bar";
import { Button } from "./ui/button";

describe("SelectionBar", () => {
  it("shows the count and bulk actions, and clears", async () => {
    const onClear = vi.fn();
    const onRestart = vi.fn();
    renderWithProviders(
      <SelectionBar count={3} onClear={onClear}>
        <Button size="sm" onClick={onRestart}>
          Restart
        </Button>
      </SelectionBar>,
    );
    expect(screen.getByRole("region", { name: "3 selected" })).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onRestart).toHaveBeenCalledOnce();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClear).toHaveBeenCalledOnce();
    await expectNoA11yViolations();
  });

  it("renders nothing when nothing is selected", () => {
    const { container } = renderWithProviders(<SelectionBar count={0} onClear={vi.fn()} />);
    expect(container.querySelector("[data-slot=selection-bar]")).toBeNull();
  });
});
