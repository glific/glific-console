import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

describe("Tooltip", () => {
  it("shows on keyboard focus and hides on Escape", async () => {
    renderWithProviders(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" aria-label="Duplicate">
            +
          </Button>
        </TooltipTrigger>
        <TooltipContent>Duplicate flow</TooltipContent>
      </Tooltip>,
    )
    await userEvent.tab()
    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent("Duplicate flow")
    await expectNoA11yViolations()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => screen.queryByRole("tooltip")).toBeNull()
  })
})
