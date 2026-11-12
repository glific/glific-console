import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group"

describe("ButtonGroup", () => {
  it("groups buttons in both orientations", async () => {
    renderWithProviders(
      <>
        <ButtonGroup aria-label="Zoom">
          <Button variant="outline">Out</Button>
          <ButtonGroupSeparator />
          <ButtonGroupText>100%</ButtonGroupText>
          <Button variant="outline">In</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" aria-label="Order">
          <Button variant="outline">Up</Button>
          <Button variant="outline">Down</Button>
        </ButtonGroup>
      </>,
    )
    expect(screen.getByRole("group", { name: "Order" })).toHaveAttribute(
      "data-orientation",
      "vertical",
    )
    await userEvent.tab()
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "In" })).toHaveFocus()
    await expectNoA11yViolations()
  })
})
