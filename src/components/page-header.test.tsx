import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { PageHeader } from "./page-header";
import { Button } from "./ui/button";

describe("PageHeader", () => {
  it("renders the title as the page heading with description", async () => {
    renderWithProviders(<PageHeader title="Contacts" description="Everyone who messaged you" />);
    await expect.element(screen.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();
    await expect.element(screen.getByText("Everyone who messaged you")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("renders actions in tab order after the heading", async () => {
    renderWithProviders(
      <PageHeader
        title="Flows"
        actions={
          <>
            <Button variant="outline">Import</Button>
            <Button>New flow</Button>
          </>
        }
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Import" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "New flow" })).toHaveFocus();
    await expectNoA11yViolations();
  });
});
