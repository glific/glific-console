import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  /** Name of the table, so several paginated tables on a page have distinct landmarks. */
  label: string;
  pageIndex: number;
  pageCount: number;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function DataTablePagination({
  label,
  pageIndex,
  pageCount,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
}: DataTablePaginationProps) {
  const { t } = useTranslation();
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={`${label}: ${t("pagination.label")}`} className="flex items-center justify-end gap-inline">
      <span className="text-body-sm text-muted-foreground" aria-live="polite">
        {t("dataTable.pageOf", { page: pageIndex + 1, pages: pageCount })}
      </span>
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={!canPrevious}>
        <ChevronLeftIcon aria-hidden="true" data-icon="inline-start" />
        {t("pagination.previous")}
      </Button>
      <Button variant="outline" size="sm" onClick={onNext} disabled={!canNext}>
        {t("pagination.next")}
        <ChevronRightIcon aria-hidden="true" data-icon="inline-end" />
      </Button>
    </nav>
  );
}
