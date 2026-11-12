import { screen } from "@testing-library/react"
import { toast } from "sonner"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Button } from "./button"

describe("Toaster", () => {
  it("announces toasts of each type", async () => {
    renderWithProviders(
      <Button
        onClick={() => {
          toast.success("Flow published")
          toast.error("Couldn't publish")
        }}
      >
        Publish
      </Button>,
    )
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(await screen.findByText("Flow published"))
      .toBeVisible()
    await expect
      .element(await screen.findByText("Couldn't publish"))
      .toBeVisible()
    await expectNoA11yViolations()
    toast.dismiss()
  })
})
