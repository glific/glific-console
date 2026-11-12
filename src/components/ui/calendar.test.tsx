import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Calendar } from "./calendar"

describe("Calendar", () => {
  it("selects a day with the keyboard", async () => {
    const onSelect = vi.fn()
    renderWithProviders(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 10, 1)}
        onSelect={onSelect}
      />,
    )
    expect(screen.getByRole("grid")).toBeVisible()
    const day = screen.getByRole("button", { name: /^12 November 2026/ })
    day.focus()
    await userEvent.keyboard("{ArrowRight}{Enter}")
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2026, 10, 13))
    await expectNoA11yViolations()
  })
})
