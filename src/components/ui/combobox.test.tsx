import { screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Combobox, type ComboboxOption } from "./combobox"

const options: ComboboxOption[] = [
  { value: "en", label: "English", group: "Common" },
  { value: "hi", label: "Hindi", group: "Common" },
  { value: "mr", label: "Marathi", group: "Regional" },
]

function Single({ onChange }: { onChange: (v: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Combobox
      aria-label="Language"
      options={options}
      value={value}
      onValueChange={(v) => {
        setValue(v)
        onChange(v)
      }}
    />
  )
}

function Multi() {
  const [value, setValue] = useState<string[]>(["en"])
  return (
    <Combobox
      multiple
      aria-label="Languages"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  )
}

describe("Combobox", () => {
  it("searches and picks one option from the keyboard", async () => {
    const onChange = vi.fn()
    renderWithProviders(<Single onChange={onChange} />)
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    const dialog = await screen.findByRole("dialog")
    await userEvent.keyboard("mara")
    await expect.poll(() => screen.queryAllByRole("option").length).toBe(1)
    await expectNoA11yViolations(dialog)
    await userEvent.keyboard("{Enter}")
    expect(onChange).toHaveBeenCalledWith("mr")
    await expect
      .element(screen.getByRole("combobox", { name: "Language" }))
      .toHaveTextContent("Marathi")
  })

  it("toggles several options in multiple mode", async () => {
    renderWithProviders(<Multi />)
    await userEvent.click(screen.getByRole("combobox", { name: "Languages" }))
    await userEvent.click(await screen.findByRole("option", { name: "Hindi" }))
    await userEvent.click(screen.getByRole("option", { name: "English" }))
    await userEvent.keyboard("{Escape}")
    const trigger = screen.getByRole("combobox", { name: "Languages" })
    await expect.poll(() => trigger.textContent).toBe("Hindi")
  })
})
