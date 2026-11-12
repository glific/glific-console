import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ChatComposer, type QuickReply } from "./chat-composer";

const quickReplies: QuickReply[] = [
  { key: "hello", name: "Greeting", text: "Hello! How can we help?" },
  { key: "helpline", name: "Helpline", text: "Call 1800-123-456" },
];

function Harness({ onSend, windowClosed }: { onSend: (t: string) => void; windowClosed?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <ChatComposer
      value={value}
      onValueChange={setValue}
      onSend={(text) => {
        onSend(text);
        setValue("");
      }}
      quickReplies={quickReplies}
      onAttach={vi.fn()}
      onRecord={vi.fn()}
      moreMenu={<DropdownMenuItem>Send a template</DropdownMenuItem>}
      emojibaseUrl="https://emoji.test/emojibase-data"
      {...(windowClosed ? { windowClosed } : {})}
    />
  );
}

describe("ChatComposer", () => {
  it("sends with Enter, adds a line with Shift+Enter, and blocks empty sends", async () => {
    const onSend = vi.fn();
    renderWithProviders(<Harness onSend={onSend} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    await userEvent.click(box);
    await userEvent.keyboard("Hi{Shift>}{Enter}{/Shift}there{Enter}");
    expect(onSend).toHaveBeenCalledWith("Hi\nthere");
    expect(box).toHaveValue("");
    await expectNoA11yViolations();
  });

  it("lists quick replies after / and inserts one with the keyboard", async () => {
    renderWithProviders(<Harness onSend={vi.fn()} />);
    const box = screen.getByRole("textbox", { name: "Message" });
    await userEvent.click(box);
    await userEvent.keyboard("/hel");
    expect(screen.getByRole("listbox", { name: "Quick replies" })).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(2);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(box).toHaveValue("Call 1800-123-456");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens the more menu and disables free text when the window has closed", async () => {
    renderWithProviders(<Harness onSend={vi.fn()} windowClosed />);
    const box = screen.getByRole("textbox", { name: "Message" });
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute("placeholder", "The 24-hour window has closed. Send a template to reach them.");
    await userEvent.click(screen.getByRole("button", { name: "More options" }));
    expect(await screen.findByRole("menuitem", { name: "Send a template" })).toBeVisible();
  });
});

describe("ChatComposer quick replies", () => {
  it("cycles with arrow keys, picks with the mouse and closes with Escape", async () => {
    // The list opens upwards, so leave room above the box for it to be clickable.
    renderWithProviders(
      <div className="pt-64">
        <Harness onSend={vi.fn()} />
      </div>,
    );
    const box = screen.getByRole("textbox", { name: "Message" });
    await userEvent.click(box);
    await userEvent.keyboard("/{ArrowUp}");
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Escape}");
    expect(box).toHaveValue("");
    await userEvent.click(box);
    await userEvent.keyboard("/");
    await userEvent.click(await screen.findByRole("option", { name: /hello/ }));
    expect(box).toHaveValue("Hello! How can we help?");
    await userEvent.clear(box);
    await userEvent.keyboard("/help{Tab}");
    expect(box).toHaveValue("Call 1800-123-456");
  });
});
