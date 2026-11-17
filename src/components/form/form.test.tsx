import { screen } from "@testing-library/react";
import { createMemoryRouter, Link, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { FormActions, FormField, FormSection, UnsavedChangesGuard, useZodForm, zodResolver } from ".";

const schema = z.object({ name: z.string().trim().min(1, "Enter a name"), keyword: z.string().optional() });

function TagForm({ onSave }: { onSave: (values: z.output<typeof schema>) => void }) {
  const form = useZodForm(schema, { name: "", keyword: "" });
  return (
    <form onSubmit={form.handleSubmit(onSave)} noValidate>
      <UnsavedChangesGuard when={form.formState.isDirty && !form.formState.isSubmitSuccessful} />
      <FormSection title="Details">
        <FormField
          control={form.control}
          name="name"
          label="Name"
          hint="Shown on the chat list"
          render={({ field, ...aria }) => <Input {...field} {...aria} />}
        />
      </FormSection>
      <FormActions onCancel={() => undefined} />
      <Link to="/elsewhere">Elsewhere</Link>
    </form>
  );
}

function renderForm(onSave = vi.fn()) {
  const router = createMemoryRouter(
    [
      { path: "/", element: <TagForm onSave={onSave} /> },
      { path: "/elsewhere", element: <h1>Elsewhere</h1> },
    ],
    { initialEntries: ["/"] },
  );
  return { router, onSave, ...renderWithProviders(<RouterProvider router={router} />) };
}

describe("forms", () => {
  it("shows a field's error once it is left, links it to the input, and submits parsed values", async () => {
    const { onSave, container } = renderForm();
    const name = screen.getByLabelText("Name");
    expect(name).toHaveAccessibleDescription("Shown on the chat list");

    await userEvent.click(name);
    await userEvent.tab();
    expect(await screen.findByText("Enter a name")).toBeVisible();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Shown on the chat list Enter a name");
    await expectNoA11yViolations(container);

    await userEvent.fill(name, "  Urgent  ");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await expect.poll(() => onSave.mock.calls.length).toBe(1);
    expect(onSave.mock.calls[0]?.[0]).toEqual({ name: "Urgent", keyword: "" });
  });

  it("asks before leaving with unsaved changes", async () => {
    const { router } = renderForm();
    await userEvent.fill(screen.getByLabelText("Name"), "Draft");
    await userEvent.click(screen.getByRole("link", { name: "Elsewhere" }));
    expect(await screen.findByRole("alertdialog", { name: "Leave without saving?" })).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(router.state.location.pathname).toBe("/");
    await expect.element(screen.getByLabelText("Name")).toHaveValue("Draft");

    await userEvent.click(await screen.findByRole("link", { name: "Elsewhere" }));
    await userEvent.click(await screen.findByRole("button", { name: "Leave" }));
    await expect.poll(() => router.state.location.pathname).toBe("/elsewhere");
  });

  it("leaves freely when nothing changed", async () => {
    const { router } = renderForm();
    await userEvent.click(screen.getByRole("link", { name: "Elsewhere" }));
    await expect.poll(() => router.state.location.pathname).toBe("/elsewhere");
  });
});

describe("zodResolver", () => {
  it("nests errors by path and keeps the first error per field", async () => {
    const nested = z.object({
      rules: z.array(z.object({ value: z.string().min(1, "Required").min(3, "Too short") })),
    });
    const result = await zodResolver(nested)({ rules: [{ value: "" }] }, undefined, {
      fields: {},
      shouldUseNativeValidation: false,
    });
    expect(result.errors).toEqual({ rules: { "0": { value: { type: "too_small", message: "Required" } } } });
  });
});
