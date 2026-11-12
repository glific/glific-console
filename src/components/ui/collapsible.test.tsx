import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"

describe("Collapsible", () => {
  it("toggles its content with Space", async () => {
    renderWithProviders(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost">Advanced settings</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>Webhook timeout</CollapsibleContent>
      </Collapsible>,
    )
    const trigger = screen.getByRole("button", { name: "Advanced settings" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await userEvent.tab()
    await userEvent.keyboard(" ")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect.element(screen.getByText("Webhook timeout")).toBeVisible()
    await expectNoA11yViolations()
  })
})
