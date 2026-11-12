import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { FileDropzone } from "./file-dropzone"

describe("FileDropzone", () => {
  it("accepts a browsed file and is reachable by keyboard", async () => {
    const onFiles = vi.fn()
    const { container } = renderWithProviders(
      <FileDropzone onFiles={onFiles} accept=".csv" />,
    )
    expect(screen.getByText("Accepts .csv")).toBeVisible()
    await userEvent.tab()
    const input = container.querySelector(
      "input[type=file]",
    ) as HTMLInputElement
    expect(input).toHaveFocus()
    await userEvent.upload(
      input,
      new File(["name,phone"], "contacts.csv", { type: "text/csv" }),
    )
    expect(onFiles).toHaveBeenCalledOnce()
    const [files] = onFiles.mock.calls[0] ?? []
    expect((files as File[] | undefined)?.[0]?.name).toBe("contacts.csv")
    await expectNoA11yViolations()
  })

  it("can be disabled", async () => {
    const { container } = renderWithProviders(
      <FileDropzone onFiles={vi.fn()} disabled hint="CSV up to 5 MB" />,
    )
    expect(screen.getByText("CSV up to 5 MB")).toBeVisible()
    expect(container.querySelector("input[type=file]")).toBeDisabled()
  })
})
