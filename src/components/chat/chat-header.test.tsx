import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ChatHeader } from "./chat-header";
import { initialsOf } from "./contact-avatar";

describe("ChatHeader", () => {
  it("shows who and the window, with keyboard-reachable actions", async () => {
    const onInfo = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(
      <ChatHeader
        name="Asha Kulkarni"
        phone="+91 98765 00001"
        group="Batch A"
        hoursLeft={5}
        onInfo={onInfo}
        onClose={onClose}
      />,
    );
    expect(screen.getByRole("heading", { name: "Asha Kulkarni" })).toBeVisible();
    expect(screen.getByText("Batch A")).toBeVisible();
    expect(screen.getByText("5h left in the window")).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onInfo).toHaveBeenCalledOnce();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalledOnce();
    await expectNoA11yViolations();
  });

  it("derives initials", () => {
    expect(initialsOf("Asha Kulkarni")).toBe("AK");
    expect(initialsOf("Meera")).toBe("M");
    expect(initialsOf("  ")).toBe("?");
  });
});
