import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface PollMessageProps {
  question: string;
  options: string[];
  multiple?: boolean;
}

export function PollMessage({ question, options, multiple }: PollMessageProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-1 min-w-56" data-slot="poll-message">
      <div className="font-semibold">{question}</div>
      <div className="mt-0.5 mb-2 text-caption text-chat-meta">
        {multiple ? t("chat.poll.multi") : t("chat.poll.single")}
      </div>
      <ul className="flex flex-col">
        {options.map((option) => (
          <li key={option} className="flex items-center gap-inline py-1.5">
            <span
              aria-hidden="true"
              className={cn("size-4 shrink-0 border-2 border-chat-meta", multiple ? "rounded-sm" : "rounded-full")}
            />
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
