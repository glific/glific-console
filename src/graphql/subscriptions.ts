import type { Client } from "graphql-ws";
import { accessToken } from "@/lib/auth";
import { backendOrigin } from "@/lib/backend";
import type { TypedDocumentString } from "./generated/graphql";

let client: Promise<Client> | null = null;

// Loaded on first subscription: only live screens (chats) need a socket, so it stays out of the initial bundle.
function socket(): Promise<Client> {
  client ??= import("graphql-ws").then(({ createClient }) =>
    createClient({
      url: `${backendOrigin().replace(/^http/, "ws")}/socket`,
      // The backend's UserSocket authenticates the whole connection from this init payload.
      connectionParams: async () => ({ authToken: await accessToken() }),
      lazy: true,
      retryAttempts: Number.POSITIVE_INFINITY,
    }),
  );
  return client;
}

/** Subscribes over the shared graphql-ws socket; returns an unsubscribe function. */
export function subscribe<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  handlers: { next: (data: TResult) => void; error?: (error: unknown) => void },
): () => void {
  let cancelled = false;
  let unsubscribe: (() => void) | null = null;
  void socket().then((ws) => {
    if (cancelled) return;
    unsubscribe = ws.subscribe<TResult>(
      { query: document.toString(), variables: variables as Record<string, unknown> },
      {
        next: (result) => {
          if (result.data) handlers.next(result.data);
        },
        error: (error) => handlers.error?.(error),
        complete: () => {},
      },
    );
  });
  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

/** Closes the socket, e.g. on sign-out, so the next subscription reconnects with the new token. */
export async function closeSubscriptions(): Promise<void> {
  const current = client;
  client = null;
  await (await current)?.dispose();
}
