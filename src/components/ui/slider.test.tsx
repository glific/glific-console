import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Slider } from "./slider"

describe("Slider", () => {
  it("changes value with arrow keys", async () => {
    const onValueChange = vi.fn()
    renderWithProviders(
      <Slider
        defaultValue={[50]}
        max={100}
        step={10}
        aria-label="Temperature"
        onValueChange={onValueChange}
      />,
    )
    await userEvent.tab()
    const thumb = screen.getByRole("slider")
    expect(thumb).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenLastCalledWith([60])
    expect(thumb).toHaveAttribute("aria-valuenow", "60")
    await expectNoA11yViolations()
  })
})
