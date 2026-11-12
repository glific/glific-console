import { ArrowUpIcon, SparklesIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AiMark({ size = "default", className }: { size?: "sm" | "default"; className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      role="img"
      aria-label={t("ai.name")}
      data-slot="ai-mark"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-ai text-ai-foreground",
        size === "sm" ? "size-5 [&_svg]:size-3" : "size-7 [&_svg]:size-4",
        className,
      )}
    >
      <SparklesIcon aria-hidden="true" />
    </span>
  );
}

interface PromptBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  busy?: boolean;
  className?: string;
}

export function PromptBox({ value, onValueChange, onSubmit, placeholder, busy, className }: PromptBoxProps) {
  const { t } = useTranslation();
  const canSubmit = !busy && value.trim().length > 0;
  return (
    <div
      data-slot="prompt-box"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-ai/30 bg-background p-2 shadow-sm focus-within:ring-3 focus-within:ring-ai/20",
        className,
      )}
    >
      <Textarea
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSubmit) onSubmit(value.trim());
          }
        }}
        aria-label={t("ai.prompt")}
        placeholder={placeholder ?? t("ai.placeholder")}
        className="min-h-14 resize-none border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between">
        <AiMark size="sm" />
        <Button
          size="icon-sm"
          className="rounded-full bg-ai text-ai-foreground hover:bg-ai/90"
          aria-label={t("ai.send")}
          disabled={!canSubmit}
          onClick={() => onSubmit(value.trim())}
        >
          <ArrowUpIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

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

export function PromptSuggestions({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (prompt: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <ul aria-label={t("ai.suggestions")} className="flex flex-wrap gap-inline" data-slot="prompt-suggestions">
      {suggestions.map((suggestion) => (
        <li key={suggestion}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full font-normal text-ai hover:bg-ai-soft hover:text-ai"
            onClick={() => onPick(suggestion)}
          >
            {suggestion}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function AiMessage({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div data-slot="ai-message" className="flex gap-inline">
      <AiMark size="sm" className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl rounded-tl-sm bg-ai-soft px-3 py-2 text-body">
        {children}
        {actions ? <div className="flex flex-wrap gap-inline">{actions}</div> : null}
      </div>
    </div>
  );
}
