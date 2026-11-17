import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

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
