import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

describe("Sheet", () => {
  it.each(["right", "left", "top", "bottom"] as const)(
    "opens on the %s side and closes with Escape",
    async (side) => {
      renderWithProviders(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Contact details</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Asha Kulkarni</SheetTitle>
              <SheetDescription>+91 98765 00001</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button>Message</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      )
      await userEvent.click(
        screen.getByRole("button", { name: "Contact details" }),
      )
      const sheet = await screen.findByRole("dialog", { name: "Asha Kulkarni" })
      expect(sheet.dataset.side).toBe(side)
      await expectNoA11yViolations(sheet)
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => screen.queryByRole("dialog")).toBeNull()
    },
  )
})
