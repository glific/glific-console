/** A GraphQL query, mutation or subscription, carrying the types of its result and variables. */
export type TypedDocument<TResult, TVariables> = string & { readonly __types?: [TResult, TVariables] };

/**
 * Marks a GraphQL operation with its generated types, e.g.
 * `graphql<ContactsQuery, ContactsQueryVariables>(\`query Contacts …\`)`. Codegen finds these calls and writes the
 * types to generated/graphql.ts; at runtime this is the plain string, so each page ships only its own operations.
 */
export function graphql<TResult, TVariables = Record<string, never>>(
  source: string,
): TypedDocument<TResult, TVariables> {
  return source as TypedDocument<TResult, TVariables>;
}
