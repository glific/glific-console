import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Label } from "./label"
import { Switch } from "./switch"

describe("Switch", () => {
  it("toggles with keyboard and renders both sizes", async () => {
    renderWithProviders(
      <>
        <Switch id="notify" />
        <Label htmlFor="notify">Notifications</Label>
        <Switch size="sm" aria-label="Compact" defaultChecked />
      </>,
    )
    const toggle = screen.getByRole("switch", { name: "Notifications" })
    await userEvent.tab()
    expect(toggle).toHaveFocus()
    await userEvent.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard("{Enter}")
    expect(toggle).toHaveAttribute("aria-checked", "false")
    expect(screen.getByRole("switch", { name: "Compact" }).dataset.size).toBe(
      "sm",
    )
    await expectNoA11yViolations()
  })
})
