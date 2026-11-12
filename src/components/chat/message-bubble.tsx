import { AlertTriangleIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { WhatsAppText } from "@/components/whatsapp/whatsapp-text";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";

export type MessageDirection = "inbound" | "outbound";

interface MessageBubbleProps {
  /** inbound: from the contact (left, white). outbound: sent by a flow or staff (right, green). */
  direction: MessageDirection;
  text?: string;
  children?: ReactNode;
  time: string;
  /** Delivery status, outbound only. */
  status?: MessageStatus;
  sender?: string;
  buttons?: string[];
  error?: string;
  onErrorClick?: () => void;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function MessageBubble({
  direction,
  text,
  children,
  time,
  status,
  sender,
  buttons,
  error,
  onErrorClick,
  meta,
  actions,
  className,
}: MessageBubbleProps) {
  const { t } = useTranslation();
  const outbound = direction === "outbound";
  return (
    <div
      data-slot="message-bubble"
      data-direction={direction}
      className={cn("group/message flex flex-col gap-1", outbound ? "items-end" : "items-start", className)}
    >
      <div className={cn("flex w-full items-center gap-1", outbound ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "max-w-120 px-3 pt-2 pb-1.5 text-body text-foreground shadow-xs",
            outbound ? "rounded-2xl rounded-tr-sm bg-chat-outbound" : "rounded-2xl rounded-tl-sm bg-chat-inbound",
            error && "border border-destructive shadow-none",
          )}
        >
          {sender ? <div className="mb-0.5 text-body-sm font-semibold text-info">{sender}</div> : null}
          {children}
          {text ? (
            <span className="break-words whitespace-pre-wrap">
              <WhatsAppText>{text}</WhatsAppText>
            </span>
          ) : null}
          <span className="float-right mt-2 -mb-1 ml-2.5 inline-flex items-center gap-1 text-caption text-chat-meta">
            <time>{time}</time>
            {outbound && status ? <MessageStatusIcon status={status} /> : null}
          </span>
          {buttons && buttons.length > 0 ? (
            <div className="clear-both flex flex-wrap gap-1 pt-2">
              {buttons.map((label) => (
                <span
                  key={label}
                  className="rounded-lg bg-background/75 px-2 py-0.5 text-body-sm text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {actions ? (
          <div className="opacity-0 transition-opacity group-focus-within/message:opacity-100 group-hover/message:opacity-100">
            {actions}
          </div>
        ) : null}
      </div>
      {error ? (
        <Button
          variant="destructive"
          size="xs"
          onClick={onErrorClick}
          title={error}
          className="h-6 max-w-120 justify-start gap-1.5 rounded-full bg-destructive-soft px-2.5 text-caption font-normal"
        >
          <AlertTriangleIcon aria-hidden="true" className="size-3 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{error}</span>
          <span className="inline-flex shrink-0 items-center font-semibold">
            {t("chat.seeError")}
            <ChevronRightIcon aria-hidden="true" className="size-3" />
          </span>
        </Button>
      ) : null}
      {meta ? <div className="flex items-center gap-1 text-caption text-muted-foreground">{meta}</div> : null}
    </div>
  );
}
