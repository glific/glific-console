import type { ReactNode } from "react";
import { GlificAiContext } from "./glific-ai-context";
import { useGlificAiChat } from "./use-glific-ai-chat";

export function GlificAiProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const chat = useGlificAiChat({ enabled });
  return <GlificAiContext.Provider value={chat}>{children}</GlificAiContext.Provider>;
}
