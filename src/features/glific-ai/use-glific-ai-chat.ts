import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/features/auth/current-user";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { subscribe } from "@/graphql/subscriptions";

const AskGlific = graphql(`
  mutation AskGlific($input: AskGlificInput!) {
    askGlific(input: $input) {
      errors {
        message
      }
    }
  }
`);

const AskGlificResponse = graphql(`
  subscription AskGlificResponse($organizationId: ID!) {
    askGlificResponse(organizationId: $organizationId) {
      answer
      conversationId
      messageId
      requestId
      errors {
        message
      }
    }
  }
`);

const AskGlificFeedback = graphql(`
  mutation AskGlificFeedback($input: AskGlificFeedbackInput!) {
    askGlificFeedback(input: $input) {
      success
    }
  }
`);

export type Feedback = "like" | "dislike";

export type ChatTurn =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "answer"; text: string; messageId: string | null; feedback: Feedback | null }
  | { id: string; role: "error"; text: string | null };

/**
 * A Glific AI conversation. The question goes out as a mutation and the answer comes back on the user's
 * subscription, which every open tab shares, so only the answer echoing this tab's request id is taken.
 * The socket opens only once the chat is in use.
 */
export function useGlificAiChat({ listening }: { listening: boolean }) {
  const organizationId = useCurrentUser().data?.organization?.id;
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const pending = useRef<string | null>(null);

  const active = listening || turns.length > 0;

  useEffect(() => {
    if (!organizationId || !active) return;
    return subscribe(
      AskGlificResponse,
      { organizationId },
      {
        next: ({ askGlificResponse: response }) => {
          if (!response?.requestId || response.requestId !== pending.current) return;
          pending.current = null;
          setPendingRequest(null);
          const id = response.requestId;
          if (response.errors?.length || !response.answer) {
            setTurns((current) => [...current, { id, role: "error", text: response.errors?.[0]?.message ?? null }]);
            return;
          }
          if (response.conversationId) setConversationId(response.conversationId);
          const text = response.answer;
          setTurns((current) => [
            ...current,
            { id, role: "answer", text, messageId: response.messageId ?? null, feedback: null },
          ]);
        },
      },
    );
  }, [organizationId, active]);

  const ask = useMutation({
    mutationFn: async ({ query, requestId }: { query: string; requestId: string }) => {
      const result = (
        await request(AskGlific, {
          input: { query, conversationId: conversationId ?? "", pageUrl: globalThis.location.href, requestId },
        })
      ).askGlific;
      if (result?.errors?.length) throw new Error(result.errors[0]?.message ?? "");
    },
    onError: (error, { requestId }) => {
      pending.current = null;
      setPendingRequest(null);
      setTurns((current) => [...current, { id: requestId, role: "error", text: error.message || null }]);
    },
  });

  const feedback = useMutation({
    mutationFn: ({ messageId, rating }: { messageId: string; rating: Feedback | null }) =>
      request(AskGlificFeedback, { input: { messageId, rating } }),
  });

  function send(query: string) {
    if (pending.current) return;
    const requestId = crypto.randomUUID();
    pending.current = requestId;
    setPendingRequest(requestId);
    setTurns((current) => [...current, { id: `${requestId}-question`, role: "user", text: query }]);
    ask.mutate({ query, requestId });
  }

  function rate(turnId: string, rating: Feedback) {
    const turn = turns.find((candidate) => candidate.id === turnId);
    if (turn?.role !== "answer") return;
    const next = turn.feedback === rating ? null : rating;
    setTurns((current) =>
      current.map((candidate) =>
        candidate.id === turnId && candidate.role === "answer" ? { ...candidate, feedback: next } : candidate,
      ),
    );
    if (turn.messageId) feedback.mutate({ messageId: turn.messageId, rating: next });
  }

  function reset() {
    pending.current = null;
    setPendingRequest(null);
    setConversationId(null);
    setTurns([]);
  }

  return { turns, thinking: pendingRequest !== null, send, rate, reset };
}
