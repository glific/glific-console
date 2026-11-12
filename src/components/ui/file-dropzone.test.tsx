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

describe("FileDropzone drag and drop", () => {
  it("highlights while dragging and accepts dropped files", async () => {
    const onFiles = vi.fn()
    const { container } = renderWithProviders(
      <FileDropzone onFiles={onFiles} multiple />,
    )
    const zone = container.querySelector(
      "[data-slot=file-dropzone]",
    ) as HTMLElement
    const data = new DataTransfer()
    data.items.add(new File(["a"], "a.csv"))
    data.items.add(new File(["b"], "b.csv"))
    zone.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: data,
      }),
    )
    await expect.poll(() => zone.dataset.dragging).toBe("true")
    zone.dispatchEvent(new DragEvent("dragleave", { bubbles: true }))
    await expect.poll(() => zone.dataset.dragging).toBeUndefined()
    zone.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: data,
      }),
    )
    expect(onFiles).toHaveBeenCalledOnce()
    expect(onFiles.mock.calls[0]?.[0]).toHaveLength(2)
  })

  it("keeps one file when not multiple and ignores drops when disabled", () => {
    const onFiles = vi.fn()
    const { container, rerender } = renderWithProviders(
      <FileDropzone onFiles={onFiles} />,
    )
    const drop = () => {
      const data = new DataTransfer()
      data.items.add(new File(["a"], "a.csv"))
      data.items.add(new File(["b"], "b.csv"))
      const zone = container.querySelector(
        "[data-slot=file-dropzone]",
      ) as HTMLElement
      zone.dispatchEvent(
        new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: data,
        }),
      )
      zone.dispatchEvent(
        new DragEvent("drop", {
          bubbles: true,
          cancelable: true,
          dataTransfer: data,
        }),
      )
    }
    drop()
    expect(onFiles.mock.calls[0]?.[0]).toHaveLength(1)
    rerender(<FileDropzone onFiles={onFiles} disabled />)
    drop()
    expect(onFiles).toHaveBeenCalledOnce()
  })
})
