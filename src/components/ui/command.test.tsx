import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command"

describe("Command", () => {
  it("filters as you type and selects with Enter", async () => {
    const onSelect = vi.fn()
    renderWithProviders(
      <Command label="Go to">
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={onSelect}>
              Flows<CommandShortcut>F</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={onSelect}>Contacts</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    await userEvent.click(screen.getByPlaceholderText("Search"))
    await userEvent.keyboard("cont")
    await expect.poll(() => screen.queryAllByRole("option").length).toBe(1)
    await expectNoA11yViolations()
    await userEvent.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith("Contacts")
    await userEvent.keyboard("{Control>}a{/Control}zzz")
    await expect.element(screen.getByText("No results")).toBeVisible()
  })
})

describe("CommandDialog", () => {
  it("opens as a titled dialog with translated defaults", async () => {
    renderWithProviders(
      <CommandDialog open>
        <Command>
          <CommandInput placeholder="Go to" />
          <CommandList>
            <CommandItem>Flows</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>,
    )
    const dialog = await screen.findByRole("dialog", { name: "Search" })
    expect(dialog).toBeVisible()
    await expectNoA11yViolations(dialog)
  })
})
