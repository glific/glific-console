import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"

describe("DropdownMenu", () => {
  it("opens with the keyboard, navigates with arrows and selects with Enter", async () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    renderWithProviders(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Flow</DropdownMenuLabel>
          <DropdownMenuItem onSelect={onEdit}>
            Edit <DropdownMenuShortcut>E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Pinned</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    const menu = await screen.findByRole("menu")
    // Radix hides everything outside an open modal menu; check the menu itself.
    await expectNoA11yViolations(menu)
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Pinned" }),
    ).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByRole("menuitem", { name: "Delete" }).dataset.variant,
    ).toBe("destructive")
    await userEvent.keyboard("{ArrowDown}{ArrowUp}")
    expect(screen.getByRole("menuitem", { name: /Edit/ })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(onEdit).toHaveBeenCalledOnce()
    expect(onDelete).not.toHaveBeenCalled()
    await expect.poll(() => screen.queryByRole("menu")).toBeNull()
  })
})
