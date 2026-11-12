import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { DayDivider, SystemNotice } from "./chat-notices";

describe("DayDivider and SystemNotice", () => {
  it("render conversation markers in each tone", async () => {
    renderWithProviders(
      <div className="bg-chat-surface p-2">
        <DayDivider>Today</DayDivider>
        <SystemNotice>Ticket #42 raised</SystemNotice>
        <SystemNotice tone="success">Restarted from “Age”</SystemNotice>
        <SystemNotice tone="warning">Window closes in 1h</SystemNotice>
      </div>,
    );
    expect(screen.getByText("Today")).toBeVisible();
    expect(screen.getByText("Window closes in 1h").parentElement?.className).toContain("text-warning");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
