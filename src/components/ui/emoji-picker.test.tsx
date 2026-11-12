import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { userEvent } from "vitest/browser"
import { renderWithProviders } from "@/test/render"
import { EmojiPicker } from "./emoji-picker"

describe("EmojiPicker", () => {
  it("opens, searches and inserts an emoji", async () => {
    const onEmojiSelect = vi.fn()
    renderWithProviders(
      <EmojiPicker
        onEmojiSelect={onEmojiSelect}
        emojibaseUrl="https://emoji.test/emojibase-data"
      />,
    )
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    const search = await screen
      .findByRole("searchbox", { name: "Search emoji" })
      .catch(() => screen.getByLabelText("Search emoji"))
    await expect
      .poll(() => screen.queryAllByText("👍").length, { timeout: 5000 })
      .toBe(1)
    await userEvent.click(search)
    await userEvent.keyboard("thumbs")
    await userEvent.click(await screen.findByText("👍"))
    expect(onEmojiSelect).toHaveBeenCalledWith("👍")
  })
})
