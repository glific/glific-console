import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

describe("Checkbox", () => {
  it("toggles with click and Space", async () => {
    const onCheckedChange = vi.fn()
    renderWithProviders(
      <div className="flex items-center gap-inline">
        <Checkbox id="optin" onCheckedChange={onCheckedChange} />
        <Label htmlFor="optin">Opt in</Label>
      </div>,
    )
    const checkbox = screen.getByRole("checkbox", { name: "Opt in" })
    await userEvent.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard(" ")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
    expect(onCheckedChange).toHaveBeenCalledTimes(2)
    await expectNoA11yViolations()
  })

  it("supports indeterminate and disabled", async () => {
    renderWithProviders(
      <Checkbox aria-label="All" checked="indeterminate" disabled />,
    )
    const checkbox = screen.getByRole("checkbox", { name: "All" })
    expect(checkbox).toHaveAttribute("aria-checked", "mixed")
    await expect.element(checkbox).toBeDisabled()
  })
})
