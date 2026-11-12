import {
  type ColumnDef,
  createPaginatedRowModel,
  createSortedRowModel,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text },
});

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

interface DataTableProps<TData extends RowData> {
  /** Keep stable (module scope or useMemo): a new array every render re-runs the row models. */
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
  label: string;
  isLoading?: boolean;
  empty?: ReactNode;
  selectable?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Rows per page for client-side pagination. Omit to show every row. */
  pageSize?: number;
  /** Server-side pagination: pass the total row count and control `pagination` yourself. */
  server?: {
    rowCount: number;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
  };
  onRowClick?: (row: TData) => void;
  className?: string;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  label,
  isLoading,
  empty,
  selectable,
  rowSelection: controlledSelection,
  onRowSelectionChange,
  pageSize,
  server,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [localSelection, setLocalSelection] = useState<RowSelectionState>({});
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? Number.MAX_SAFE_INTEGER,
  });

  const sorting = server?.sorting ?? localSorting;
  const pagination = server?.pagination ?? localPagination;
  const rowSelection = controlledSelection ?? localSelection;

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: (row) => getRowId(row),
    enableRowSelection: Boolean(selectable),
    state: { sorting, pagination, rowSelection },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (server) server.onSortingChange(next);
      else setLocalSorting(next);
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      if (server) server.onPaginationChange(next);
      else setLocalPagination(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      if (onRowSelectionChange) onRowSelectionChange(next);
      else setLocalSelection(next);
    },
    ...(server ? { manualPagination: true, manualSorting: true, rowCount: server.rowCount } : {}),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const columnCount = columns.length + (selectable ? 1 : 0);
  const paginated = Boolean(server) || pageSize !== undefined;

  return (
    <div className={cn("flex flex-col gap-stack", className)} data-slot="data-table">
      <Table aria-label={label} aria-busy={isLoading || undefined}>
        <TableHeader>
          {headerGroups.map((group) => (
            <TableRow key={group.id}>
              {selectable ? (
                <TableHead className="w-10">
                  <Checkbox
                    aria-label={t("dataTable.selectAll")}
                    checked={
                      table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
                  />
                </TableHead>
              ) : null}
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2.5"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {sorted === "asc" ? (
                          <ArrowUpIcon aria-hidden="true" />
                        ) : sorted === "desc" ? (
                          <ArrowDownIcon aria-hidden="true" />
                        ) : (
                          <ArrowUpDownIcon aria-hidden="true" className="text-muted-foreground" />
                        )}
                      </Button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [0, 1, 2, 3, 4].map((row) => (
              <TableRow key={`loading-${row}`}>
                <TableCell colSpan={columnCount}>
                  <Skeleton className="h-5" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="p-0">
                {empty ?? <p className="p-section text-center text-muted-foreground">{t("dataTable.empty")}</p>}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={onRowClick ? "cursor-pointer" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {selectable ? (
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      aria-label={t("dataTable.selectRow")}
                      checked={row.getIsSelected()}
                      onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                    />
                  </TableCell>
                ) : null}
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {paginated && !isLoading ? (
        <DataTablePagination
          label={label}
          pageIndex={table.state.pagination.pageIndex}
          pageCount={table.getPageCount()}
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          onPrevious={() => table.previousPage()}
          onNext={() => table.nextPage()}
        />
      ) : null}
    </div>
  );
}
