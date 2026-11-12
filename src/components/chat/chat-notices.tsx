import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DayDivider({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 flex justify-center" data-slot="day-divider">
      <span className="rounded-full border bg-background px-3 py-1 text-caption font-medium text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

interface SystemNoticeProps {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning";
  icon?: ReactNode;
}

export function SystemNotice({ children, tone = "neutral", icon }: SystemNoticeProps) {
  return (
    <div className="my-3 flex justify-center" data-slot="system-notice">
      <span
        className={cn(
          "inline-flex max-w-128 items-center gap-1.5 rounded-full px-3 py-1 text-body-sm [&_svg]:size-3 [&_svg]:shrink-0",
          tone === "success" && "bg-success-soft text-success",
          tone === "warning" && "bg-warning-soft text-warning",
          tone === "neutral" && "bg-background text-muted-foreground",
        )}
      >
        {icon ?? (tone === "success" ? <CheckIcon aria-hidden="true" /> : null)}
        <span className="min-w-0 truncate">{children}</span>
      </span>
    </div>
  );
}
