import type { PaginationState, RowData, RowSelectionState, SortingState } from "@tanstack/react-table";
import { SearchXIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { SelectionBar } from "@/components/selection-bar";
import { SearchInput } from "@/components/ui/search-input";

interface ListPageProps<TRow extends RowData> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  search: { value: string; onValueChange: (value: string) => void; placeholder: string };
  filters?: ReactNode;
  label: string;
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string;
  total: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  isLoading: boolean;
  error?: { title: string; onRetry: () => void } | null;
  /** Shown when the list is empty and no search is active. */
  empty: { title: string; description?: string; icon?: ReactNode; action?: ReactNode };
  noResults: { title: string; description?: string };
  onRowClick?: (row: TRow) => void;
  bulkActions?: (selected: string[], clear: () => void) => ReactNode;
}

/**
 * The standard list screen (flows, contacts, templates, triggers, ...): header, search, filters, a
 * server-paginated table and every state. Pages supply data and columns; this owns layout and states.
 */
export function ListPage<TRow extends RowData>({
  title,
  description,
  actions,
  search,
  filters,
  label,
  columns,
  rows,
  getRowId,
  total,
  pagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  isLoading,
  error,
  empty,
  noResults,
  onRowClick,
  bulkActions,
}: ListPageProps<TRow>) {
  const { t } = useTranslation();
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const selected = Object.keys(selection).filter((id) => selection[id]);
  const searching = search.value.trim() !== "";

  let body: ReactNode;
  if (error) {
    body = <ErrorState title={error.title} onRetry={error.onRetry} />;
  } else if (!isLoading && total === 0 && !searching) {
    body = <EmptyState {...empty} />;
  } else {
    body = (
      <DataTable
        label={label}
        columns={columns}
        data={rows}
        getRowId={getRowId}
        isLoading={isLoading}
        empty={<EmptyState className="border-0" icon={<SearchXIcon />} {...noResults} />}
        selectable={Boolean(bulkActions)}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        server={{
          rowCount: total,
          pagination,
          onPaginationChange,
          sorting: controlledSorting ?? localSorting,
          onSortingChange: onSortingChange ?? setLocalSorting,
        }}
        {...(onRowClick ? { onRowClick } : {})}
      />
    );
  }

  return (
    <div className="flex flex-col gap-section">
      <PageHeader title={title} description={description} actions={actions} />
      <div className="flex flex-col gap-stack">
        <div className="flex flex-wrap items-center gap-inline">
          <SearchInput
            value={search.value}
            onValueChange={(value) => {
              search.onValueChange(value);
              onPaginationChange({ ...pagination, pageIndex: 0 });
            }}
            placeholder={search.placeholder}
            className="w-full sm:w-80"
          />
          {filters}
          {!error && total > 0 ? (
            <span className="ml-auto text-body-sm text-muted-foreground" aria-live="polite">
              {t("list.total", { count: total })}
            </span>
          ) : null}
        </div>
        {bulkActions ? (
          <SelectionBar count={selected.length} onClear={() => setSelection({})}>
            {bulkActions(selected, () => setSelection({}))}
          </SelectionBar>
        ) : null}
        {body}
      </div>
    </div>
  );
}
