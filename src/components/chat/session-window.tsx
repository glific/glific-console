import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SessionWindowProps {
  /** Hours left in WhatsApp's 24-hour customer service window; null/0 when closed. Undefined for channels without one. */
  hoursLeft: number | null | undefined;
  className?: string;
}

function formatHours(hours: number): string {
  if (hours >= 1) return `${Math.floor(hours)}h`;
  return `${Math.max(1, Math.round(hours * 60))}m`;
}

/** How long staff can still message freely (live app Timer). Turns amber in the last 3 hours, muted when closed. */
export function SessionWindow({ hoursLeft, className }: SessionWindowProps) {
  const { t } = useTranslation();
  const state =
    hoursLeft === undefined ? "none" : !hoursLeft || hoursLeft <= 0 ? "closed" : hoursLeft <= 3 ? "closing" : "open";
  const text =
    state === "none"
      ? t("chat.window.none")
      : state === "closed"
        ? t("chat.window.closed")
        : t(`chat.window.${state}`, { time: formatHours(hoursLeft as number) });
  return (
    <span
      data-slot="session-window"
      data-state={state}
      className={cn(
        "font-medium",
        state === "open" && "text-success",
        state === "closing" && "text-warning",
        (state === "closed" || state === "none") && "text-muted-foreground",
        className,
      )}
    >
      {text}
    </span>
  );
}
