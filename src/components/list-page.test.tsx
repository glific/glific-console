import { screen } from "@testing-library/react";
import { UsersIcon } from "lucide-react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import type { DataTableColumn } from "./data-table";
import { ListPage } from "./list-page";
import { Button } from "./ui/button";

interface Row {
  id: string;
  name: string;
}

const columns: DataTableColumn<Row>[] = [{ accessorKey: "name", header: "Name", enableSorting: false }];
const rows: Row[] = [
  { id: "1", name: "Welcome" },
  { id: "2", name: "Registration" },
];

function Harness(props: {
  rows?: Row[];
  total?: number;
  isLoading?: boolean;
  error?: boolean;
  onBulk?: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 2 });
  const onRetry = vi.fn();
  return (
    <ListPage
      title="Flows"
      description="Build conversations."
      actions={<Button>New flow</Button>}
      search={{ value: search, onValueChange: setSearch, placeholder: "Search flows" }}
      filters={<Button variant="outline">Filters</Button>}
      label="Flows"
      columns={columns}
      rows={props.rows ?? rows}
      getRowId={(row) => row.id}
      total={props.total ?? 5}
      pagination={pagination}
      onPaginationChange={setPagination}
      isLoading={props.isLoading ?? false}
      error={props.error ? { title: "Couldn't load flows", onRetry } : null}
      empty={{ title: "No flows yet", description: "Create one.", icon: <UsersIcon /> }}
      noResults={{ title: "No matching flows" }}
      {...(props.onBulk
        ? {
            bulkActions: (ids: string[], clear: () => void) => (
              <Button
                size="sm"
                onClick={() => {
                  props.onBulk?.(ids);
                  clear();
                }}
              >
                Archive
              </Button>
            ),
          }
        : {})}
    />
  );
}

describe("ListPage", () => {
  it("renders header, search, total, table and server pagination", async () => {
    renderWithProviders(<Harness />);
    expect(screen.getByRole("heading", { level: 1, name: "Flows" })).toBeVisible();
    expect(screen.getByText("5 results")).toBeVisible();
    expect(screen.getByRole("table", { name: "Flows" })).toBeVisible();
    expect(screen.getByText("Page 1 of 3")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 3")).toBeVisible();
    await userEvent.fill(screen.getByRole("searchbox", { name: "Search flows" }), "reg");
    expect(screen.getByText("Page 1 of 3")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("shows the empty state, the no-results state, loading and errors", async () => {
    const { rerender } = renderWithProviders(<Harness rows={[]} total={0} />);
    expect(screen.getByRole("heading", { name: "No flows yet" })).toBeVisible();
    await userEvent.fill(screen.getByRole("searchbox", { name: "Search flows" }), "zzz");
    expect(await screen.findByRole("heading", { name: "No matching flows" })).toBeVisible();
    rerender(<Harness isLoading rows={[]} total={0} />);
    rerender(<Harness error />);
    expect(screen.getByRole("alert").textContent).toContain("Couldn't load flows");
    await expectNoA11yViolations();
  });

  it("runs bulk actions on selected rows", async () => {
    const onBulk = vi.fn();
    renderWithProviders(<Harness onBulk={onBulk} />);
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[1] as HTMLElement);
    expect(screen.getByRole("region", { name: "1 selected" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(onBulk).toHaveBeenCalledWith(["2"]);
    expect(screen.queryByRole("region", { name: /selected/ })).toBeNull();
  });
});
