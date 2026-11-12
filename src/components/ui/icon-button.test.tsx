import { screen } from "@testing-library/react"
import { CopyIcon } from "lucide-react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { IconButton } from "./icon-button"

describe("IconButton", () => {
  it("has an accessible name, shows it as a tooltip on focus, and activates", async () => {
    const onClick = vi.fn()
    renderWithProviders(
      <IconButton icon={CopyIcon} label="Duplicate flow" onClick={onClick} />,
    )
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "Duplicate flow" })).toHaveFocus()
    expect((await screen.findByRole("tooltip")).textContent).toContain(
      "Duplicate flow",
    )
    await userEvent.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledOnce()
    await expectNoA11yViolations()
  })

  it("supports sizes, variants and no tooltip", async () => {
    renderWithProviders(
      <IconButton
        icon={CopyIcon}
        label="Copy"
        size="sm"
        variant="outline"
        tooltip={false}
      />,
    )
    const button = screen.getByRole("button", { name: "Copy" })
    expect(button.dataset.size).toBe("icon-sm")
    expect(button.dataset.variant).toBe("outline")
    await userEvent.tab()
    expect(screen.queryByRole("tooltip")).toBeNull()
  })
})
