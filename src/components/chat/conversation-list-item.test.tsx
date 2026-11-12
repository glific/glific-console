import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ConversationListItem } from "./conversation-list-item";

describe("ConversationListItem", () => {
  it("shows name, preview, time and unread count, and selects from the keyboard", async () => {
    const onSelect = vi.fn();
    renderWithProviders(
      <div className="w-80">
        <ConversationListItem
          name="Rahul Verma"
          preview="When is the next class?"
          time="10:42"
          unread={2}
          tone="warning"
          toneLabel="Waiting for a reply"
          onSelect={onSelect}
        />
        <ConversationListItem name="Meera Iyer" preview="Thanks!" time="Yesterday" selected onSelect={vi.fn()} />
      </div>,
    );
    expect(screen.getByText("2 unread")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Waiting for a reply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Meera Iyer/ })).toHaveAttribute("aria-current", "true");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    await expectNoA11yViolations();
  });
});
