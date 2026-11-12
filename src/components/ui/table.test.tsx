import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Checkbox } from "./checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

describe("Table", () => {
  it("renders an accessible table whose interactive cells are keyboard reachable", async () => {
    renderWithProviders(
      <Table>
        <TableCaption>Recent contacts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>
              <Checkbox aria-label="Select Asha" />
            </TableCell>
            <TableCell>Asha</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>1 contact</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )
    const table = screen.getByRole("table", { name: "Recent contacts" })
    expect(table).toBeVisible()
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    await userEvent.tab()
    expect(screen.getByRole("checkbox", { name: "Select Asha" })).toHaveFocus()
    await expectNoA11yViolations()
  })
})
