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
    expect(screen.getByRole("radio", { name: "whatsapp" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    expect(screen.getByRole("radio", { name: "sms" })).toBeChecked()
    expect(onValueChange).toHaveBeenLastCalledWith("sms")
    await expectNoA11yViolations()
  })
})
