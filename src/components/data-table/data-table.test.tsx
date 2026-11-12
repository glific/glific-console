import type { RowSelectionState } from "@tanstack/react-table";
import { screen } from "@testing-library/react";
import { useMemo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { DataTable, type DataTableColumn } from "./data-table";

interface Flow {
  id: string;
  name: string;
  runs: number;
}

const rows: Flow[] = [
  { id: "1", name: "Welcome", runs: 30 },
  { id: "2", name: "Registration", runs: 10 },
  { id: "3", name: "Feedback", runs: 20 },
];

function Harness({ pageSize, onSelect }: { pageSize?: number; onSelect?: (s: RowSelectionState) => void }) {
  const columns = useMemo<DataTableColumn<Flow>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "runs", header: "Runs" },
    ],
    [],
  );
  const [selection, setSelection] = useState<RowSelectionState>({});
  return (
    <DataTable
      label="Flows"
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      selectable
      rowSelection={selection}
      onRowSelectionChange={(next) => {
        setSelection(next);
        onSelect?.(next);
      }}
      {...(pageSize ? { pageSize } : {})}
    />
  );
}

const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelectorAll("td")[1]?.textContent);

describe("DataTable", () => {
  it("sorts by a column from the keyboard and reports aria-sort", async () => {
    renderWithProviders(<Harness />);
    expect(screen.getByRole("table", { name: "Flows" })).toBeVisible();
    screen.getByRole("button", { name: /Runs/ }).focus();
    await userEvent.keyboard("{Enter}");
    // Numeric columns sort highest first (TanStack's default), then flip.
    await expect.poll(names).toEqual(["Welcome", "Feedback", "Registration"]);
    expect(screen.getByRole("columnheader", { name: /Runs/ })).toHaveAttribute("aria-sort", "descending");
    await userEvent.keyboard("{Enter}");
    await expect.poll(names).toEqual(["Registration", "Feedback", "Welcome"]);
    await expectNoA11yViolations();
  });

  it("selects all rows and single rows", async () => {
    const onSelect = vi.fn();
    renderWithProviders(<Harness onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect(onSelect).toHaveBeenLastCalledWith({ 1: true, 2: true, 3: true });
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0] as HTMLElement);
    expect(onSelect).toHaveBeenLastCalledWith({ 2: true, 3: true });
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toHaveAttribute("aria-checked", "mixed");
  });

  it("paginates on the client", async () => {
    renderWithProviders(<Harness pageSize={2} />);
    expect(names()).toHaveLength(2);
    expect(screen.getByText("Page 1 of 2")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await expect.poll(names).toEqual(["Feedback"]);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("shows loading and empty states", async () => {
    const columns: DataTableColumn<Flow>[] = [{ accessorKey: "name", header: "Name" }];
    const { rerender } = renderWithProviders(
      <DataTable label="Flows" columns={columns} data={[]} getRowId={(r) => r.id} isLoading />,
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    rerender(
      <DataTable label="Flows" columns={columns} data={[]} getRowId={(r) => r.id} empty={<p>No flows yet</p>} />,
    );
    expect(screen.getByText("No flows yet")).toBeVisible();
  });
});
