import { fetchWithSession } from "@/lib/auth";
import { apiBaseUrl } from "@/lib/backend";
import type { TypedDocumentString } from "./generated/graphql";

export class GraphQLRequestError extends Error {
  override name = "GraphQLRequestError";
  constructor(
    message: string,
    readonly errors: readonly { message: string; path?: readonly (string | number)[] }[],
    readonly status?: number,
  ) {
    super(message);
  }
}

/** Runs a typed query or mutation against the Glific GraphQL API (`/api`), with the session's access token. */
export async function request<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  const response = await fetchWithSession(apiBaseUrl(), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ query: document.toString(), variables }),
  });

  const body = (await response.json().catch(() => null)) as {
    data?: TResult;
    errors?: GraphQLRequestError["errors"];
  } | null;

  if (!response.ok || !body) {
    throw new GraphQLRequestError(`Request failed: ${response.status}`, body?.errors ?? [], response.status);
  }
  if (body.errors?.length) {
    throw new GraphQLRequestError(body.errors.map((error) => error.message).join("; "), body.errors, response.status);
  }
  return body.data as TResult;
}
