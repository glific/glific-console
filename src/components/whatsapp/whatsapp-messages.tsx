import { ExternalLinkIcon, ListIcon, MapPinIcon, PhoneIcon, ReplyIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { WhatsAppText } from "./whatsapp-text";

export type TemplateButton =
  | { type: "quick_reply"; text: string }
  | { type: "url"; text: string; url: string }
  | { type: "phone"; text: string; phone: string };

function Card({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="w-full max-w-64 self-start overflow-hidden rounded-xl rounded-tl-sm bg-chat-inbound text-body-sm text-foreground shadow-xs">
      <div className="flex flex-col gap-1 px-2.5 pt-2 pb-1.5">{children}</div>
      {footer}
    </div>
  );
}

function Action({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1.5 border-t py-2 text-body-sm font-medium text-info [&_svg]:size-3.5">
      {icon}
      <span className="truncate">{children}</span>
    </div>
  );
}

function Meta({ time }: { time?: string }) {
  return time ? <span className="self-end text-caption text-chat-meta">{time}</span> : null;
}

interface TemplateMessageProps {
  header?: string;
  /** Body text with {{1}}-style variables already filled, or shown as-is. WhatsApp formatting supported. */
  body: string;
  footer?: string;
  buttons?: TemplateButton[];
  /** A media header (image URL) instead of a text header. */
  mediaUrl?: string;
  time?: string;
}

/** An HSM template as the contact sees it: header, body, footer and buttons (live app HSM preview). */
export function TemplateMessage({ header, body, footer, buttons = [], mediaUrl, time }: TemplateMessageProps) {
  return (
    <Card
      footer={buttons.map((button) => (
        <Action
          key={button.text}
          icon={
            button.type === "url" ? (
              <ExternalLinkIcon aria-hidden="true" />
            ) : button.type === "phone" ? (
              <PhoneIcon aria-hidden="true" />
            ) : (
              <ReplyIcon aria-hidden="true" />
            )
          }
        >
          {button.text}
        </Action>
      ))}
    >
      {mediaUrl ? <img src={mediaUrl} alt="" className="-mx-1 mb-1 rounded-lg" /> : null}
      {header ? <div className="font-semibold">{header}</div> : null}
      <div className="whitespace-pre-wrap">
        <WhatsAppText>{body}</WhatsAppText>
      </div>
      {footer ? <div className="text-caption text-chat-meta">{footer}</div> : null}
      <Meta {...(time ? { time } : {})} />
    </Card>
  );
}

interface QuickReplyMessageProps {
  body: string;
  /** Up to 3 reply buttons. */
  options: string[];
  time?: string;
}

/** Interactive quick-reply message: text with up to three reply buttons (live app QuickReplyTemplate). */
export function QuickReplyMessage({ body, options, time }: QuickReplyMessageProps) {
  return (
    <div className="flex w-full max-w-64 flex-col gap-1 self-start">
      <Card>
        <div className="whitespace-pre-wrap">
          <WhatsAppText>{body}</WhatsAppText>
        </div>
        <Meta {...(time ? { time } : {})} />
      </Card>
      {options.map((option) => (
        <div
          key={option}
          className="rounded-xl bg-chat-inbound py-2 text-center text-body-sm font-medium text-info shadow-xs"
        >
          {option}
        </div>
      ))}
    </div>
  );
}

interface ListMessageProps {
  body: string;
  /** Text on the button that opens the list. */
  buttonText?: string;
  sections: { title: string; items: { title: string; description?: string }[] }[];
  /** Show the list as opened (WhatsApp's bottom sheet), as in the live app's preview. */
  expanded?: boolean;
  time?: string;
}

/** Interactive list message: text plus a button that opens sections of options (live app ListReplyTemplate). */
export function ListMessage({ body, buttonText, sections, expanded, time }: ListMessageProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-64 flex-col gap-1 self-start">
      <Card footer={<Action icon={<ListIcon aria-hidden="true" />}>{buttonText ?? t("whatsapp.listButton")}</Action>}>
        <div className="whitespace-pre-wrap">
          <WhatsAppText>{body}</WhatsAppText>
        </div>
        <Meta {...(time ? { time } : {})} />
      </Card>
      {expanded ? (
        <div className="rounded-xl bg-chat-inbound p-2 text-body-sm shadow-xs">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <div className="px-1 pt-1 pb-0.5 text-caption font-medium text-success">{section.title}</div>
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className={cn("flex items-center justify-between gap-2 border-b px-1 py-1.5 last:border-0")}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{item.title}</span>
                    {item.description ? (
                      <span className="truncate text-caption text-chat-meta">{item.description}</span>
                    ) : null}
                  </span>
                  <span aria-hidden="true" className="size-3.5 shrink-0 rounded-full border-2 border-chat-meta" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Location request message: text plus WhatsApp's "Send location" button (live app LocationRequestTemplate). */
export function LocationRequestMessage({ body, time }: { body: string; time?: string }) {
  const { t } = useTranslation();
  return (
    <Card footer={<Action icon={<MapPinIcon aria-hidden="true" />}>{t("whatsapp.sendLocation")}</Action>}>
      <div className="whitespace-pre-wrap">
        <WhatsAppText>{body}</WhatsAppText>
      </div>
      <Meta {...(time ? { time } : {})} />
    </Card>
  );
}
