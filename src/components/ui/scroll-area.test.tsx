import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { ScrollArea } from "./scroll-area"

describe("ScrollArea", () => {
  it("scrolls long content and is keyboard focusable", async () => {
    renderWithProviders(
      <ScrollArea className="h-24 w-48" aria-label="Recent flows">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>Flow {i + 1}</p>
        ))}
      </ScrollArea>,
    )
    expect(screen.getByText("Flow 20")).toBeInTheDocument()
    await userEvent.tab()
    expect(document.activeElement?.getAttribute("data-slot")).toBe(
      "scroll-area-viewport",
    )
    await expectNoA11yViolations()
  })
})
