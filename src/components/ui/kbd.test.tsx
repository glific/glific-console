import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Kbd, KbdGroup } from "./kbd"

describe("Kbd", () => {
  it("renders key hints", async () => {
    renderWithProviders(
      <p>
        Press{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>{" "}
        to search
      </p>,
    )
    expect(screen.getByText("K").tagName).toBe("KBD")
    await userEvent.tab()
    expect(document.body).toHaveFocus()
    await expectNoA11yViolations()
  })
})
