import type { RowSelectionState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { SelectionBar } from "@/components/SelectionBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FlowRow {
  id: string;
  name: string;
  status: "Published" | "Draft";
  runs: number;
  updated: string;
}

const flowRows: FlowRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: ["Welcome", "Registration", "Feedback", "Certificates", "Reminders", "Quiz"][i % 6] + (i >= 6 ? " v2" : ""),
  status: i % 3 === 0 ? "Draft" : "Published",
  runs: (i * 7919) % 9000,
  updated: `${(i % 28) + 1} Nov`,
}));

export function DataTableDemo() {
  const columns = useMemo<DataTableColumn<FlowRow>[]>(
    () => [
      { accessorKey: "name", header: "Flow" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "Published" ? "success" : "neutral"}>{row.original.status}</Badge>
        ),
      },
      { accessorKey: "runs", header: "Runs" },
      { accessorKey: "updated", header: "Updated", enableSorting: false },
    ],
    [],
  );
  const [selection, setSelection] = useState<RowSelectionState>({});
  const count = Object.keys(selection).length;
  return (
    <div className="flex w-full flex-col gap-stack">
      <SelectionBar count={count} onClear={() => setSelection({})}>
        <Button size="sm" variant="outline">
          Duplicate
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </SelectionBar>
      <DataTable
        label="Flows"
        columns={columns}
        data={flowRows}
        getRowId={(row) => row.id}
        selectable
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        pageSize={5}
      />
    </div>
  );
}
