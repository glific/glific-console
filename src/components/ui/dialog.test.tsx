import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Rename flow</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename flow</DialogTitle>
          <DialogDescription>
            Give this flow a name your team will recognise.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("opens from the keyboard, traps focus and closes with Escape", async () => {
    renderWithProviders(<Example />)
    const trigger = screen.getByRole("button", { name: "Rename flow" })
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    const dialog = await screen.findByRole("dialog", { name: "Rename flow" })
    expect(dialog).toHaveAccessibleDescription(
      "Give this flow a name your team will recognise.",
    )
    expect(dialog.contains(document.activeElement)).toBe(true)
    await expectNoA11yViolations(dialog)
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => screen.queryByRole("dialog")).toBeNull()
    await expect.element(trigger).toHaveFocus()
  })

  it("has translated close buttons", async () => {
    renderWithProviders(<Example />)
    await userEvent.click(screen.getByRole("button", { name: "Rename flow" }))
    expect(
      await screen.findAllByRole("button", { name: "Close" }),
    ).toHaveLength(2)
    await userEvent.click(
      screen.getAllByRole("button", { name: "Close" })[0] as HTMLElement,
    )
    await expect.poll(() => screen.queryByRole("dialog")).toBeNull()
  })
})
