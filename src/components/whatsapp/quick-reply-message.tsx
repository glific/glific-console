import { BubbleCard } from "./bubble-card";
import { BubbleMeta } from "./bubble-meta";
import { WhatsAppText } from "./whatsapp-text";

interface QuickReplyMessageProps {
  body: string;
  /** Up to 3 reply buttons. */
  options: string[];
  time?: string;
}

export function QuickReplyMessage({ body, options, time }: QuickReplyMessageProps) {
  return (
    <div className="flex w-full max-w-64 flex-col gap-1 self-start">
      <BubbleCard>
        <div className="whitespace-pre-wrap">
          <WhatsAppText>{body}</WhatsAppText>
        </div>
        <BubbleMeta {...(time ? { time } : {})} />
      </BubbleCard>
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
