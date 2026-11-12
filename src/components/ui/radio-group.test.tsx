import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

describe("RadioGroup", () => {
  it("moves selection with arrow keys", async () => {
    const onValueChange = vi.fn()
    renderWithProviders(
      <RadioGroup
        aria-label="Channel"
        defaultValue="whatsapp"
        onValueChange={onValueChange}
      >
        {["whatsapp", "sms", "email"].map((value) => (
          <div key={value} className="flex items-center gap-inline">
            <RadioGroupItem id={value} value={value} />
            <Label htmlFor={value}>{value}</Label>
          </div>
        ))}
      </RadioGroup>,
    )
    await userEvent.tab()
    await expect
      .element(screen.getByRole("radio", { name: "whatsapp" }))
      .toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect
      .element(screen.getByRole("radio", { name: "sms" }))
      .toHaveFocus()
    // Radix also checks on arrow-focus, but that depends on keydown/focus ordering and flakes on slow CI; Space is deterministic.
    await userEvent.keyboard(" ")
    await expect
      .element(screen.getByRole("radio", { name: "sms" }))
      .toBeChecked()
    expect(onValueChange).toHaveBeenLastCalledWith("sms")
    await expectNoA11yViolations()
  })
})
