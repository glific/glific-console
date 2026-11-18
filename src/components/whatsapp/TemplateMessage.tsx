import { ExternalLinkIcon, PhoneIcon, ReplyIcon } from "lucide-react";
import { BubbleAction } from "./BubbleAction";
import { BubbleCard } from "./BubbleCard";
import { BubbleMeta } from "./BubbleMeta";
import { WhatsAppText } from "./WhatsAppText";

export type TemplateButton =
  | { type: "quick_reply"; text: string }
  | { type: "url"; text: string; url: string }
  | { type: "phone"; text: string; phone: string };

interface TemplateMessageProps {
  header?: string;
  body: string;
  footer?: string;
  buttons?: TemplateButton[];
  mediaUrl?: string;
  time?: string;
}

export function TemplateMessage({ header, body, footer, buttons = [], mediaUrl, time }: TemplateMessageProps) {
  return (
    <BubbleCard
      footer={buttons.map((button) => (
        <BubbleAction
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
        </BubbleAction>
      ))}
    >
      {mediaUrl ? <img src={mediaUrl} alt="" className="-mx-1 mb-1 rounded-lg" /> : null}
      {header ? <div className="font-semibold">{header}</div> : null}
      <div className="whitespace-pre-wrap">
        <WhatsAppText>{body}</WhatsAppText>
      </div>
      {footer ? <div className="text-caption text-chat-meta">{footer}</div> : null}
      <BubbleMeta {...(time ? { time } : {})} />
    </BubbleCard>
  );
}
