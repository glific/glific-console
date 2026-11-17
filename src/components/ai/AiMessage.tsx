import type { ReactNode } from "react";
import { AiMark } from "./AiMark";

export function AiMessage({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div data-slot="ai-message" className="flex gap-inline">
      <AiMark size="sm" className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl rounded-tl-sm bg-ai-soft px-3 py-2 text-body">
        {children}
        {actions ? <div className="flex flex-wrap gap-inline">{actions}</div> : null}
      </div>
    </div>
  );
}
