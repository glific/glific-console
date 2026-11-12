import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { PollMessage } from "./poll-message";

describe("PollMessage", () => {
  it("shows the question, the options and whether several can be picked", async () => {
    renderWithProviders(
      <>
        <PollMessage question="When should we meet?" options={["Monday", "Friday"]} />
        <PollMessage question="Which topics?" options={["Health", "Jobs"]} multiple />
      </>,
    );
    expect(screen.getByText("Select one")).toBeVisible();
    expect(screen.getByText("Select one or more")).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
