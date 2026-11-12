import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

describe("Accordion", () => {
  it("expands with Enter and moves between items with arrows", async () => {
    renderWithProviders(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What is a flow?</AccordionTrigger>
          <AccordionContent>A conversation you build once.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>What is a template?</AccordionTrigger>
          <AccordionContent>A message approved by Meta.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(screen.getByText("A conversation you build once."))
      .toBeVisible()
    await userEvent.keyboard("{ArrowDown}")
    expect(
      screen.getByRole("button", { name: "What is a template?" }),
    ).toHaveFocus()
    await expectNoA11yViolations()
  })
})
