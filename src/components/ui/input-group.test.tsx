import { screen } from "@testing-library/react"
import { AtSignIcon } from "lucide-react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group"

describe("InputGroup", () => {
  it("combines addons, text and buttons around an input or textarea", async () => {
    const onCopy = vi.fn()
    renderWithProviders(
      <>
        <InputGroup>
          <InputGroupAddon>
            <AtSignIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Email" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={onCopy}>Copy</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea aria-label="Bio" />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/160</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </>,
    )
    await userEvent.tab()
    expect(screen.getByLabelText("Email")).toHaveFocus()
    await userEvent.keyboard("a@b.org")
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    expect(onCopy).toHaveBeenCalledOnce()
    await expectNoA11yViolations()
  })
})
