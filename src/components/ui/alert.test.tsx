import { screen } from "@testing-library/react"
import { AlertCircleIcon } from "lucide-react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Alert, AlertDescription, AlertTitle } from "./alert"

describe("Alert", () => {
  it("renders default and destructive alerts", async () => {
    renderWithProviders(
      <>
        <Alert>
          <AlertTitle>Template approved</AlertTitle>
          <AlertDescription>You can use it in flows now.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Webhook failed</AlertTitle>
          <AlertDescription>The endpoint returned 500.</AlertDescription>
        </Alert>
      </>,
    )
    const alerts = screen.getAllByRole("alert")
    expect(alerts).toHaveLength(2)
    expect(alerts[1]?.dataset.variant ?? alerts[1]?.className).toContain(
      "destructive",
    )
    await userEvent.tab()
    expect(document.body).toHaveFocus()
    await expectNoA11yViolations()
  })
})
