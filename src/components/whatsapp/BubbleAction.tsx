import type { ReactNode } from "react";

export function BubbleAction({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1.5 border-t py-2 text-body-sm font-medium text-info [&_svg]:size-3.5">
      {icon}
      <span className="truncate">{children}</span>
    </div>
  );
}
