import { ArrowDownIcon, ArrowUpIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  /** Secondary line under the value, e.g. "of 1,204 contacts". */
  sub?: ReactNode;
  icon?: LucideIcon;
  /** Change versus the previous period, e.g. 12 or -3 (percent). */
  trend?: number;
  className?: string;
}

/** A big number with a label (prototype StatTile), for dashboards and analytics. */
export function StatTile({ label, value, sub, icon: Icon, trend, className }: StatTileProps) {
  return (
    <Card size="sm" className={className} data-slot="stat-tile">
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-center gap-inline text-body-sm text-muted-foreground">
          {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
          <span>{label}</span>
        </div>
        <div className="flex items-baseline gap-inline">
          <span className="text-display">{value}</span>
          {trend !== undefined ? (
            <span
              className={cn(
                "inline-flex items-center text-body-sm font-medium",
                trend >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {trend >= 0 ? (
                <ArrowUpIcon aria-hidden="true" className="size-3" />
              ) : (
                <ArrowDownIcon aria-hidden="true" className="size-3" />
              )}
              {Math.abs(trend)}%
            </span>
          ) : null}
        </div>
        {sub ? <span className="text-body-sm text-muted-foreground">{sub}</span> : null}
      </CardContent>
    </Card>
  );
}
