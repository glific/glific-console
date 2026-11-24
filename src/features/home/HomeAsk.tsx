import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PromptBox } from "@/components/ai";
import { Button } from "@/components/ui/button";
import { useGlificAi } from "@/features/glific-ai/glific-ai-context";
import { useSideApps } from "@/features/shell";

interface HomeAskProps {
  suggestions: string[];
}

export function HomeAsk({ suggestions }: HomeAskProps) {
  const { t } = useTranslation();
  const chat = useGlificAi();
  const sideApps = useSideApps();
  const [question, setQuestion] = useState("");

  return (
    <div className="flex w-full flex-col gap-stack">
      <PromptBox
        value={question}
        onValueChange={setQuestion}
        busy={chat.thinking}
        placeholder={t("home.ask.placeholder")}
        className="bg-background shadow-sm"
        onSubmit={(prompt) => {
          chat.send(prompt);
          setQuestion("");
          sideApps.show("glificAi");
        }}
      />
      <ul aria-label={t("ai.suggestions")} className="flex flex-wrap justify-center gap-inline">
        {suggestions.map((suggestion) => (
          <li key={suggestion}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent font-normal text-muted-foreground hover:bg-background"
              onClick={() => setQuestion(suggestion)}
            >
              {suggestion}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
