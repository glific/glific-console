import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Separator } from "./separator"

describe("Separator", () => {
  it("is decorative by default and semantic when asked", async () => {
    renderWithProviders(
      <>
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
      </>,
    )
    expect(screen.getByTestId("decorative")).toHaveAttribute("role", "none")
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    )
    await userEvent.tab()
    expect(document.body).toHaveFocus()
    await expectNoA11yViolations()
  })
})
