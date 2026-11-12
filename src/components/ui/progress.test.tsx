import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Progress } from "./progress"

describe("Progress", () => {
  it("exposes its value", async () => {
    renderWithProviders(<Progress value={40} aria-label="Import progress" />)
    const bar = screen.getByRole("progressbar", { name: "Import progress" })
    expect(bar).toHaveAttribute("aria-valuenow", "40")
    await userEvent.tab()
    expect(document.body).toHaveFocus()
    await expectNoA11yViolations()
  })
})
