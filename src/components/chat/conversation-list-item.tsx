import { useTranslation } from "react-i18next";
import { StatusDot } from "@/components/status-dot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContactAvatar } from "./contact-avatar";

interface ConversationListItemProps {
  name: string;
  preview: string;
  time: string;
  unread?: number;
  tone?: "danger" | "warning" | "success";
  toneLabel?: string;
  selected?: boolean;
  onSelect: () => void;
}

export function ConversationListItem({
  name,
  preview,
  time,
  unread,
  tone,
  toneLabel,
  selected,
  onSelect,
}: ConversationListItemProps) {
  const { t } = useTranslation();
  return (
    <Button
      variant="ghost"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      data-slot="conversation-list-item"
      className={cn(
        "h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left font-normal whitespace-normal hover:bg-accent",
        selected && "bg-primary-soft hover:bg-primary-soft",
      )}
    >
      <span className="relative shrink-0">
        <ContactAvatar name={name} />
        {tone ? (
          <StatusDot
            tone={tone}
            {...(toneLabel ? { label: toneLabel } : {})}
            className="absolute -right-0.5 -bottom-0.5 size-2.5 ring-2 ring-background"
          />
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-baseline justify-between gap-inline">
          <span className={cn("truncate text-body", unread ? "font-semibold" : "font-medium")}>{name}</span>
          <span className={cn("shrink-0 text-caption", unread ? "text-primary" : "text-muted-foreground")}>{time}</span>
        </span>
        <span className="flex items-center justify-between gap-inline">
          <span className="truncate text-body-sm text-muted-foreground">{preview}</span>
          {unread ? (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-caption font-semibold text-primary-foreground">
              <span aria-hidden="true">{unread}</span>
              <span className="sr-only">{t("chat.unread", { count: unread })}</span>
            </span>
          ) : null}
        </span>
      </span>
    </Button>
  );
}
