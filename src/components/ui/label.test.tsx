import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

describe("Label", () => {
  it("labels and activates its control", async () => {
    renderWithProviders(
      <>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </>,
    )
    await userEvent.click(screen.getByText("Accept terms"))
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard(" ")
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toHaveAttribute("aria-checked", "false")
    await expectNoA11yViolations()
  })
})
