import { createContext, useContext } from "react";
import type { useGlificAiChat } from "./use-glific-ai-chat";

export type GlificAiChat = ReturnType<typeof useGlificAiChat>;

export const GlificAiContext = createContext<GlificAiChat | null>(null);

export function useGlificAi(): GlificAiChat {
  const chat = useContext(GlificAiContext);
  if (!chat) throw new Error("useGlificAi must be used inside GlificAiProvider.");
  return chat;
}
