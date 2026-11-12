import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Skeleton } from "./skeleton"

describe("Skeleton", () => {
  it("renders a decorative placeholder that is never focusable", async () => {
    renderWithProviders(
      <Skeleton data-testid="skeleton" className="h-4 w-32" />,
    )
    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton.dataset.slot).toBe("skeleton")
    expect(skeleton.className).toContain("animate-pulse")
    await userEvent.tab()
    expect(document.body).toHaveFocus()
    await expectNoA11yViolations()
  })
})
