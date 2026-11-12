import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

describe("Card", () => {
  it("renders all slots and keeps actions keyboard reachable", async () => {
    renderWithProviders(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Messages today</CardTitle>
          <CardDescription>Across all flows</CardDescription>
          <CardAction>
            <Button variant="ghost">View</Button>
          </CardAction>
        </CardHeader>
        <CardContent>1,204</CardContent>
        <CardFooter>Updated just now</CardFooter>
      </Card>,
    )
    expect(screen.getByText("Messages today").dataset.slot).toBe("card-title")
    expect(screen.getByText("1,204")).toBeVisible()
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "View" })).toHaveFocus()
    await expectNoA11yViolations()
  })
})
