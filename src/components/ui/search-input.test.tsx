import { screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { SearchInput } from "./search-input"

function Harness() {
  const [value, setValue] = useState("")
  return (
    <SearchInput
      value={value}
      onValueChange={setValue}
      placeholder="Search flows"
    />
  )
}

describe("SearchInput", () => {
  it("types, clears with the button and with Escape", async () => {
    renderWithProviders(<Harness />)
    const input = screen.getByRole("searchbox", { name: "Search flows" })
    await userEvent.click(input)
    await userEvent.keyboard("welcome")
    expect(input).toHaveValue("welcome")
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }))
    expect(input).toHaveValue("")
    await userEvent.click(input)
    await userEvent.keyboard("abc{Escape}")
    expect(input).toHaveValue("")
    await expectNoA11yViolations()
  })
})
