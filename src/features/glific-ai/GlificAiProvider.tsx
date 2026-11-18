import type { ReactNode } from "react";
import { GlificAiContext } from "./glific-ai-context";
import { useGlificAiChat } from "./use-glific-ai-chat";

export function GlificAiProvider({ listening, children }: { listening: boolean; children: ReactNode }) {
  const chat = useGlificAiChat({ listening });
  return <GlificAiContext.Provider value={chat}>{children}</GlificAiContext.Provider>;
}
