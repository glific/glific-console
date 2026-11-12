import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "./avatar"

describe("Avatar", () => {
  it("shows the fallback and renders every size", async () => {
    renderWithProviders(
      <AvatarGroup>
        {(["sm", "default", "lg"] as const).map((size) => (
          <Avatar key={size} size={size} data-testid={`avatar-${size}`}>
            <AvatarFallback>AK</AvatarFallback>
            <AvatarBadge />
          </Avatar>
        ))}
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    )
    expect(screen.getAllByText("AK")).toHaveLength(3)
    expect(screen.getByTestId("avatar-lg").dataset.size).toBe("lg")
    expect(screen.getByText("+3")).toBeVisible()
    await expectNoA11yViolations()
  })

  it("is not a tab stop", async () => {
    renderWithProviders(
      <Avatar>
        <AvatarFallback>RV</AvatarFallback>
      </Avatar>,
    )
    await userEvent.tab()
    expect(document.body).toHaveFocus()
  })
})
