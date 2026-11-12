import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { MessageBubble } from "./message-bubble";
import { MessageStatusIcon } from "./message-status";

describe("MessageBubble", () => {
  it("renders inbound and outbound messages with WhatsApp formatting and delivery status", async () => {
    renderWithProviders(
      <div className="bg-chat-surface p-4">
        <MessageBubble direction="inbound" text="Hi, I want to *register*" time="10:02" sender="Asha" />
        <MessageBubble
          direction="outbound"
          text="Welcome! Reply 1 for _English_"
          time="10:03"
          status="read"
          buttons={["English", "हिन्दी"]}
        />
      </div>,
    );
    const bubbles = document.querySelectorAll("[data-slot=message-bubble]");
    expect(bubbles[0]?.getAttribute("data-direction")).toBe("inbound");
    expect(screen.getByText("register").tagName).toBe("STRONG");
    expect(screen.getByText("English", { selector: "em" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Read" })).toBeVisible();
    expect(screen.getByText("हिन्दी")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("makes a failed message's error clickable from the keyboard", async () => {
    const onErrorClick = vi.fn();
    renderWithProviders(
      <MessageBubble
        direction="outbound"
        text="Your certificate is ready"
        time="10:05"
        status="error"
        error="Webhook returned 500"
        onErrorClick={onErrorClick}
        meta={<span>Certificates › Send PDF</span>}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onErrorClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("img", { name: "Not delivered" })).toBeVisible();
    expect(screen.getByText("Certificates › Send PDF")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("labels every delivery status", () => {
    renderWithProviders(
      <div>
        {(["pending", "sent", "delivered", "read", "error"] as const).map((status) => (
          <MessageStatusIcon key={status} status={status} />
        ))}
      </div>,
    );
    for (const name of ["Sending", "Sent", "Delivered", "Read", "Not delivered"]) {
      expect(screen.getByRole("img", { name })).toBeInTheDocument();
    }
  });
});
