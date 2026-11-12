import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Input } from "./input"
import { Label } from "./label"

describe("Input + Label", () => {
  it("is labelled, accepts typing and supports the invalid state", async () => {
    const onChange = vi.fn()
    renderWithProviders(
      <>
        <Label htmlFor="name">Name</Label>
        <Input id="name" onChange={onChange} />
        <Label htmlFor="email">Email</Label>
        <Input id="email" aria-invalid defaultValue="nope" />
      </>,
    )
    const input = screen.getByLabelText("Name")
    await userEvent.click(screen.getByText("Name"))
    expect(input).toHaveFocus()
    await userEvent.keyboard("Asha")
    expect(input).toHaveValue("Asha")
    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    )
    await expectNoA11yViolations()
  })

  it("can be disabled", async () => {
    renderWithProviders(<Input aria-label="Phone" disabled />)
    await expect.element(screen.getByLabelText("Phone")).toBeDisabled()
  })
})
