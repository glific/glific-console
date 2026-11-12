import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button, buttonVariants } from "./button"

describe("Button", () => {
  it("renders every variant and size accessibly", async () => {
    const variants = [
      "default",
      "outline",
      "secondary",
      "ghost",
      "destructive",
      "link",
    ] as const
    renderWithProviders(
      <div>
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button size="sm">small</Button>
        <Button size="lg">large</Button>
        <Button size="icon" aria-label="icon only">
          +
        </Button>
      </div>,
    )
    for (const variant of variants) {
      expect(
        screen.getByRole("button", { name: variant }).dataset.variant,
      ).toBe(variant)
    }
    expect(screen.getByRole("button", { name: "small" }).dataset.size).toBe(
      "sm",
    )
    expect(buttonVariants({ variant: "destructive" })).toContain(
      "text-destructive",
    )
    await expectNoA11yViolations()
  })

  it("activates with Enter and Space, and not when disabled", async () => {
    const onClick = vi.fn()
    renderWithProviders(
      <>
        <Button onClick={onClick}>Save</Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      </>,
    )
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    expect(onClick).toHaveBeenCalledTimes(2)
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "Disabled" })).not.toHaveFocus()
  })

  it("keeps AA contrast while hovered", async () => {
    renderWithProviders(<Button>Publish</Button>)
    await userEvent.hover(screen.getByRole("button", { name: "Publish" }))
    await expectNoA11yViolations()
  })

  it("renders as its child with asChild", async () => {
    renderWithProviders(
      <Button asChild>
        <a href="/contacts">Contacts</a>
      </Button>,
    )
    expect(screen.getByRole("link", { name: "Contacts" }).dataset.slot).toBe(
      "button",
    )
  })
})
