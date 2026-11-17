import type { ReactNode } from "react";

export function DayDivider({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 flex justify-center" data-slot="day-divider">
      <span className="rounded-full border bg-background px-3 py-1 text-caption font-medium text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
