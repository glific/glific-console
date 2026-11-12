import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

describe("ToggleGroup", () => {
  it("works as a segmented control with arrow keys", async () => {
    const onValueChange = vi.fn()
    renderWithProviders(
      <ToggleGroup
        type="single"
        defaultValue="list"
        variant="outline"
        aria-label="View"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    )
    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("grid")
    expect(screen.getByRole("radio", { name: "Grid" })).toHaveAttribute(
      "aria-checked",
      "true",
    )
    await expectNoA11yViolations()
  })
})
