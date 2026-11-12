import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("accepts multi-line input from the keyboard", async () => {
    renderWithProviders(<Textarea aria-label="Message" />)
    const textarea = screen.getByLabelText("Message")
    await userEvent.click(textarea)
    await userEvent.keyboard("Hello{Shift>}{Enter}{/Shift}there")
    expect(textarea).toHaveValue("Hello\nthere")
    await expectNoA11yViolations()
  })

  it("reflects the invalid and disabled states", async () => {
    renderWithProviders(<Textarea aria-label="Notes" aria-invalid disabled />)
    const textarea = screen.getByLabelText("Notes")
    expect(textarea).toHaveAttribute("aria-invalid", "true")
    await expect.element(textarea).toBeDisabled()
  })
})
