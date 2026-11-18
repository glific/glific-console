import { SquarePenIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiMark, AiMessage, PromptBox, PromptSuggestions, ThinkingIndicator } from "@/components/ai";
import { Button } from "@/components/ui/button";
import { useGlificAi } from "./glific-ai-context";

export function GlificAiPanel() {
  const { t } = useTranslation();
  const chat = useGlificAi();
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const suggestions = [
    t("glificAi.suggestions.debug"),
    t("glificAi.suggestions.ai"),
    t("glificAi.suggestions.sheets"),
    t("glificAi.suggestions.broadcast"),
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever a turn arrives or thinking starts
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [chat.turns.length, chat.thinking]);

  function send(prompt: string) {
    chat.send(prompt);
    setDraft("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-stack overflow-y-auto p-stack" aria-live="polite">
        {chat.turns.length === 0 ? (
          <div className="flex flex-col gap-stack">
            <div className="flex items-center gap-inline">
              <AiMark />
              <p className="text-subheading">{t("glificAi.greeting")}</p>
            </div>
            <p className="text-body text-muted-foreground">{t("glificAi.intro")}</p>
            <PromptSuggestions suggestions={suggestions} onPick={send} />
          </div>
        ) : null}
        {chat.turns.map((turn) => {
          if (turn.role === "user") {
            return (
              <p
                key={turn.id}
                className="max-w-4/5 self-end rounded-2xl rounded-tr-sm bg-muted px-3 py-2 text-body whitespace-pre-wrap"
              >
                {turn.text}
              </p>
            );
          }
          if (turn.role === "error") {
            return (
              <p key={turn.id} role="alert" className="text-body text-destructive">
                {turn.text || t("glificAi.error")}
              </p>
            );
          }
          return (
            <AiMessage
              key={turn.id}
              actions={
                turn.messageId ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("glificAi.helpful")}
                      aria-pressed={turn.feedback === "like"}
                      onClick={() => chat.rate(turn.id, "like")}
                    >
                      <ThumbsUpIcon aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("glificAi.notHelpful")}
                      aria-pressed={turn.feedback === "dislike"}
                      onClick={() => chat.rate(turn.id, "dislike")}
                    >
                      <ThumbsDownIcon aria-hidden="true" />
                    </Button>
                  </>
                ) : undefined
              }
            >
              <p className="whitespace-pre-wrap">{turn.text}</p>
            </AiMessage>
          );
        })}
        {chat.thinking ? <ThinkingIndicator /> : null}
        <div ref={end} />
      </div>
      <div className="flex flex-col gap-inline border-t p-stack">
        {chat.turns.length > 0 ? (
          <Button variant="ghost" size="sm" className="self-start" onClick={chat.reset}>
            <SquarePenIcon aria-hidden="true" data-icon="inline-start" />
            {t("glificAi.newChat")}
          </Button>
        ) : null}
        <PromptBox
          value={draft}
          onValueChange={setDraft}
          onSubmit={send}
          busy={chat.thinking}
          placeholder={t("glificAi.placeholder")}
        />
      </div>
    </div>
  );
}
