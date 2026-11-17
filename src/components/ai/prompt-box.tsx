import { ArrowUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AiMark } from "./ai-mark";

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
