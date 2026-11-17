import type { ReactNode } from "react";

export function BubbleCard({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="w-full max-w-64 self-start overflow-hidden rounded-xl rounded-tl-sm bg-chat-inbound text-body-sm text-foreground shadow-xs">
      <div className="flex flex-col gap-1 px-2.5 pt-2 pb-1.5">{children}</div>
      {footer}
    </div>
  );
}
