import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders every variant", async () => {
    const variants = [
      "default",
      "secondary",
      "destructive",
      "outline",
      "ghost",
      "link",
    ] as const
    renderWithProviders(
      <div>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>,
    )
    for (const variant of variants) {
      expect(screen.getByText(variant).dataset.variant).toBe(variant)
    }
    await expectNoA11yViolations()
  })

  it("is focusable when rendered as a link", async () => {
    renderWithProviders(
      <Badge asChild>
        <a href="/contacts">Contacts</a>
      </Badge>,
    )
    await userEvent.tab()
    expect(screen.getByRole("link", { name: "Contacts" })).toHaveFocus()
  })
})
