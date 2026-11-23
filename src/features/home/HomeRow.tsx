import type { ReactNode } from "react";

export interface HomeRowProps {
  icon: ReactNode;
  title: string;
  detail?: string;
}

export function HomeRow({ icon, title, detail }: HomeRowProps) {
  return (
    <li className="flex items-center gap-3 px-stack py-2.5">
      <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body">{title}</span>
        {detail ? <span className="truncate text-body-sm text-muted-foreground">{detail}</span> : null}
      </div>
    </li>
  );
}
