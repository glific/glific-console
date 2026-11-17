import { SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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
