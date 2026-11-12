import { screen } from "@testing-library/react";
import { MessageSquareIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { StatTile } from "./stat-tile";

describe("StatTile", () => {
  it("shows a value with label, icon, sub line and up/down trends", async () => {
    renderWithProviders(
      <>
        <StatTile label="Messages today" value="1,204" sub="across 8 flows" icon={MessageSquareIcon} trend={12} />
        <StatTile label="Opt-outs" value="9" trend={-3} />
      </>,
    );
    expect(screen.getByText("1,204")).toBeVisible();
    expect(screen.getByText("12%").className).toContain("text-success");
    expect(screen.getByText("3%").className).toContain("text-destructive");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
