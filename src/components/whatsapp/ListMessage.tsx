import { ListIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { BubbleAction } from "./BubbleAction";
import { BubbleCard } from "./BubbleCard";
import { BubbleMeta } from "./BubbleMeta";
import { WhatsAppText } from "./WhatsAppText";

interface ListMessageProps {
  body: string;
  buttonText?: string;
  sections: { title: string; items: { title: string; description?: string }[] }[];
  expanded?: boolean;
  time?: string;
}

export function ListMessage({ body, buttonText, sections, expanded, time }: ListMessageProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-64 flex-col gap-1 self-start">
      <BubbleCard
        footer={
          <BubbleAction icon={<ListIcon aria-hidden="true" />}>{buttonText ?? t("whatsapp.listButton")}</BubbleAction>
        }
      >
        <div className="whitespace-pre-wrap">
          <WhatsAppText>{body}</WhatsAppText>
        </div>
        <BubbleMeta {...(time ? { time } : {})} />
      </BubbleCard>
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
