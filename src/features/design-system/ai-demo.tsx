import { useState } from "react";
import { AiMessage, PromptBox, PromptSuggestions, ThinkingIndicator } from "@/components/ai";
import { Button } from "@/components/ui/button";

export function AiDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-full max-w-xl flex-col gap-stack">
      <PromptSuggestions
        suggestions={["Build a registration flow", "Why do people drop off?", "Fix this flow's errors"]}
        onPick={setValue}
      />
      <PromptBox value={value} onValueChange={setValue} onSubmit={() => setValue("")} />
      <ThinkingIndicator />
      <AiMessage
        actions={
          <>
            <Button size="sm" className="bg-ai text-ai-foreground hover:bg-ai/90">
              Fix both
            </Button>
            <Button size="sm" variant="outline">
              Show me
            </Button>
          </>
        }
      >
        Two steps in “Registration” have no reply for Hindi. I can add the missing translations.
      </AiMessage>
    </div>
  );
}
