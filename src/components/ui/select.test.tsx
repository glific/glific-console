import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Label } from "./label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

describe("Select", () => {
  it("opens with the keyboard and picks an option", async () => {
    const onValueChange = vi.fn()
    renderWithProviders(
      <>
        <Label htmlFor="language">Language</Label>
        <Select onValueChange={onValueChange}>
          <SelectTrigger id="language" size="sm">
            <SelectValue placeholder="Choose a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>,
    )
    const trigger = screen.getByRole("combobox", { name: "Language" })
    expect(trigger.dataset.size).toBe("sm")
    await expectNoA11yViolations()
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    await screen.findByRole("listbox")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenCalledOnce()
    const labels: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    }
    const picked = labels[String(onValueChange.mock.calls[0]?.[0])]
    await expect.element(trigger).toHaveTextContent(picked ?? "missing")
  })
})
