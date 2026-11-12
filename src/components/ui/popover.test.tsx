import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover"

describe("Popover", () => {
  it("toggles from the keyboard and closes with Escape", async () => {
    renderWithProviders(
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filters</Button>
        </PopoverTrigger>
        <PopoverContent aria-labelledby="filter-title">
          <PopoverHeader>
            <PopoverTitle id="filter-title">Filter contacts</PopoverTitle>
            <PopoverDescription>
              Show only opted-in contacts.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )
    const trigger = screen.getByRole("button", { name: "Filters" })
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(await screen.findByText("Filter contacts"))
      .toBeVisible()
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expectNoA11yViolations()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => screen.queryByText("Filter contacts")).toBeNull()
    await expect.element(trigger).toHaveFocus()
  })
})
