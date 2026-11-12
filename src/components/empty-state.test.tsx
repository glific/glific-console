import { screen } from "@testing-library/react";
import { UsersIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { EmptyState } from "./empty-state";
import { Button } from "./ui/button";

describe("EmptyState", () => {
  it("renders title, description, decorative icon and a keyboard-reachable action", async () => {
    const onCreate = vi.fn();
    renderWithProviders(
      <EmptyState
        icon={<UsersIcon />}
        title="No contacts yet"
        description="Contacts appear here once someone messages you."
        action={<Button onClick={onCreate}>Import contacts</Button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "No contacts yet" })).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledOnce();
    await expectNoA11yViolations();
  });

  it("supports a page-level heading and minimal content", async () => {
    renderWithProviders(<EmptyState headingLevel={1} title="Nothing here" />);
    expect(screen.getByRole("heading", { level: 1, name: "Nothing here" })).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
    await expectNoA11yViolations();
  });
});
