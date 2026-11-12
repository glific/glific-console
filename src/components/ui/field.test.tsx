import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field"
import { Input } from "./input"
import { Switch } from "./switch"

describe("Field", () => {
  it("wires label, description and de-duplicated errors", async () => {
    renderWithProviders(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field data-invalid>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" aria-invalid aria-describedby="name-help" />
            <FieldDescription id="name-help">
              As it appears on WhatsApp.
            </FieldDescription>
            <FieldError
              errors={[
                { message: "Name is required" },
                { message: "Name is required" },
              ]}
            />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="optin">Opted in</FieldLabel>
            </FieldContent>
            <Switch id="optin" />
          </Field>
          <Field>
            <FieldError
              errors={[
                { message: "Too short" },
                { message: "Must be a number" },
              ]}
            />
          </Field>
        </FieldGroup>
      </FieldSet>,
    )
    expect(screen.getByRole("group", { name: "Profile" })).toBeVisible()
    expect(screen.getByLabelText("Name")).toHaveAccessibleDescription(
      "As it appears on WhatsApp.",
    )
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(
      "Name is required",
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    await userEvent.tab()
    expect(screen.getByLabelText("Name")).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole("switch", { name: "Opted in" })).toHaveFocus()
    await expectNoA11yViolations()
  })

  it("renders nothing when there are no errors", async () => {
    const { container } = renderWithProviders(<FieldError errors={[]} />)
    expect(container.querySelector("[data-slot=field-error]")).toBeNull()
  })
})
