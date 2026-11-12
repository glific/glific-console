import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"

describe("HoverCard", () => {
  it("opens on keyboard focus", async () => {
    renderWithProviders(
      <HoverCard openDelay={0}>
        <HoverCardTrigger href="#contacts">Registration group</HoverCardTrigger>
        <HoverCardContent>124 contacts · created 2 Nov</HoverCardContent>
      </HoverCard>,
    )
    await userEvent.tab()
    expect(
      screen.getByRole("link", { name: "Registration group" }),
    ).toHaveFocus()
    await expect
      .element(await screen.findByText("124 contacts · created 2 Nov"))
      .toBeVisible()
    await expectNoA11yViolations()
  })
})
