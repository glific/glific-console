import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

describe("Pagination", () => {
  it("renders translated, keyboard-reachable page links", async () => {
    renderWithProviders(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeVisible()
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await userEvent.tab()
    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toHaveFocus()
    expect(screen.getByRole("link", { name: "Go to next page" })).toBeVisible()
    await expectNoA11yViolations()
  })
})
