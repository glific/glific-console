import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./item"

describe("Item", () => {
  it("renders list rows in each variant with actions", async () => {
    renderWithProviders(
      <ItemGroup>
        {(["default", "outline", "muted"] as const).map((variant) => (
          <Item key={variant} variant={variant} data-testid={variant}>
            <ItemMedia variant="icon">#</ItemMedia>
            <ItemContent>
              <ItemTitle>Welcome flow</ItemTitle>
              <ItemDescription>{variant}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm">Open {variant}</Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>,
    )
    expect(screen.getByTestId("outline").dataset.variant).toBe("outline")
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "Open default" })).toHaveFocus()
    await expectNoA11yViolations()
  })
})
