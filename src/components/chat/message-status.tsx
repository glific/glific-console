import { AlertCircleIcon, CheckCheckIcon, CheckIcon, ClockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type MessageStatus = "pending" | "sent" | "delivered" | "read" | "error";

/** WhatsApp delivery ticks: clock, one tick, two ticks, two blue ticks, or an error mark. */
export function MessageStatusIcon({ status, className }: { status: MessageStatus; className?: string }) {
  const { t } = useTranslation();
  const label = t(`chat.status.${status}`);
  const Icon =
    status === "pending"
      ? ClockIcon
      : status === "sent"
        ? CheckIcon
        : status === "error"
          ? AlertCircleIcon
          : CheckCheckIcon;
  return (
    <Icon
      role="img"
      aria-label={label}
      data-status={status}
      className={cn(
        "size-3.5 shrink-0",
        status === "read" ? "text-chat-read" : status === "error" ? "text-destructive" : "text-chat-meta",
        className,
      )}
    />
  );
}
