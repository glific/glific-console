import { screen } from "@testing-library/react"
import { BoldIcon } from "lucide-react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Toggle } from "./toggle"

describe("Toggle", () => {
  it("toggles pressed state with Space in both variants", async () => {
    renderWithProviders(
      <>
        <Toggle aria-label="Bold">
          <BoldIcon />
        </Toggle>
        <Toggle variant="outline" size="sm" aria-label="Italic">
          I
        </Toggle>
      </>,
    )
    const bold = screen.getByRole("button", { name: "Bold" })
    await userEvent.tab()
    await userEvent.keyboard(" ")
    expect(bold).toHaveAttribute("aria-pressed", "true")
    await expectNoA11yViolations()
  })
})
