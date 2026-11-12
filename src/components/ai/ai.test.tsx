import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { Button } from "@/components/ui/button";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { AiMark, AiMessage, PromptBox, PromptSuggestions, ThinkingIndicator } from "./ai";

function Harness({ onSubmit, busy }: { onSubmit: (p: string) => void; busy?: boolean }) {
  const [value, setValue] = useState("");
  return <PromptBox value={value} onValueChange={setValue} onSubmit={onSubmit} {...(busy ? { busy } : {})} />;
}

describe("Glific AI components", () => {
  it("submits a prompt with Enter, not while busy", async () => {
    const onSubmit = vi.fn();
    const { rerender } = renderWithProviders(<Harness onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox", { name: "Ask Glific AI" });
    await userEvent.click(box);
    await userEvent.keyboard("Build a registration flow{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("Build a registration flow");
    rerender(<Harness onSubmit={onSubmit} busy />);
    expect(screen.getByRole("button", { name: "Ask" })).toBeDisabled();
    await expectNoA11yViolations();
  });

  it("renders the mark, thinking state, suggestions and a reply", async () => {
    const onPick = vi.fn();
    renderWithProviders(
      <>
        <AiMark />
        <ThinkingIndicator />
        <PromptSuggestions suggestions={["Fix errors", "Summarise drop-offs"]} onPick={onPick} />
        <AiMessage actions={<Button size="sm">Apply</Button>}>I found 2 steps with no reply.</AiMessage>
      </>,
    );
    expect(screen.getAllByRole("img", { name: "Glific AI" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("status").textContent).toContain("Thinking…");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onPick).toHaveBeenCalledWith("Fix errors");
    expect(screen.getByText("I found 2 steps with no reply.")).toBeVisible();
    await expectNoA11yViolations();
  });
});
