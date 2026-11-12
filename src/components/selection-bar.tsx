import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

interface SelectionBarProps {
  count: number;
  onClear: () => void;
  /** Bulk actions for the selected rows, usually small Buttons. */
  children?: ReactNode;
  className?: string;
}

/** Bar shown while list rows are ticked: how many, bulk actions, clear (prototype SelectionBar). */
export function SelectionBar({ count, onClear, children, className }: SelectionBarProps) {
  const { t } = useTranslation();
  if (count === 0) return null;
  return (
    <section
      aria-label={t("dataTable.selection", { count })}
      data-slot="selection-bar"
      className={cn(
        "flex flex-wrap items-center gap-inline rounded-lg bg-primary-soft px-3 py-1.5 text-body text-primary",
        className,
      )}
    >
      <span className="font-medium" aria-live="polite">
        {t("dataTable.selection", { count })}
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-inline">{children}</div>
      <IconButton icon={XIcon} label={t("dataTable.clearSelection")} size="sm" onClick={onClear} />
    </section>
  );
}
