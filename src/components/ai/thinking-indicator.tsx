import { useTranslation } from "react-i18next";
import { AiMark } from "./ai-mark";

export function ThinkingIndicator({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      data-slot="thinking-indicator"
      className="inline-flex items-center gap-inline text-body-sm text-ai"
    >
      <AiMark size="sm" />
      <span className="flex gap-1" aria-hidden="true">
        <span className="size-1.5 animate-bounce rounded-full bg-ai" />
        <span className="size-1.5 animate-bounce rounded-full bg-ai [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-ai [animation-delay:300ms]" />
      </span>
      <span>{label ?? t("ai.thinking")}</span>
    </div>
  );
}
