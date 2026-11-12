import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { SessionWindow } from "./session-window";

describe("SessionWindow", () => {
  it("shows open, closing, closed and no-window states", async () => {
    renderWithProviders(
      <>
        <SessionWindow hoursLeft={20} />
        <SessionWindow hoursLeft={0.5} />
        <SessionWindow hoursLeft={0} />
        <SessionWindow hoursLeft={undefined} />
      </>,
    );
    expect(screen.getByText("20h left in the window").dataset.state).toBe("open");
    expect(screen.getByText("30m left in the window").dataset.state).toBe("closing");
    expect(screen.getByText("Window closed").dataset.state).toBe("closed");
    expect(screen.getByText("No message window").dataset.state).toBe("none");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
