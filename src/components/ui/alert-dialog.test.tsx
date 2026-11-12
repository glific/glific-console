import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { Button } from "./button"

describe("AlertDialog", () => {
  it("focuses Cancel first, confirms with the action and supports the destructive variant", async () => {
    const onConfirm = vi.fn()
    renderWithProviders(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete flow</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this flow?</AlertDialogTitle>
            <AlertDialogDescription>
              Contacts currently in it will stop receiving messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Delete flow" }))
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this flow?",
    })
    expect(dialog.dataset.size).toBe("sm")
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    await expectNoA11yViolations(dialog)
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    expect(onConfirm).toHaveBeenCalledOnce()
    await expect.poll(() => screen.queryByRole("alertdialog")).toBeNull()
  })
})
