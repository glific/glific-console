import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { WhatsAppText } from "./whatsapp-text";

describe("WhatsAppText", () => {
  it("renders WhatsApp formatting and line breaks without injecting HTML", async () => {
    const { container } = renderWithProviders(
      <p>
        <WhatsAppText>{"*Bold* _italic_ ~gone~ ```code```\nnext line <b>not html</b> 2*3*4"}</WhatsAppText>
      </p>,
    );
    expect(screen.getByText("Bold").tagName).toBe("STRONG");
    expect(screen.getByText("italic").tagName).toBe("EM");
    expect(screen.getByText("gone").tagName).toBe("S");
    expect(screen.getByText("code").tagName).toBe("CODE");
    expect(container.querySelector("br")).not.toBeNull();
    expect(container.querySelector("b")).toBeNull();
    expect(container.textContent).toContain("<b>not html</b>");
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});
