import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("is a labelled status in every size and never takes focus", async () => {
    renderWithProviders(
      <>
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" label="Sending messages" />
      </>,
    );
    const spinners = screen.getAllByRole("status");
    expect(spinners).toHaveLength(3);
    expect(spinners[0]).toHaveAccessibleName("Loading");
    expect(spinners[0]?.getAttribute("class")).toContain("size-4");
    expect(screen.getByRole("status", { name: "Sending messages" }).getAttribute("class")).toContain("size-8");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
