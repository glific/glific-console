import { QueryCache, QueryClient } from "@tanstack/react-query";
import { GraphQLRequestError } from "@/graphql/client";
import { ApiError } from "./api-client";
import { reportError } from "./monitoring";

function isClientError(error: unknown): boolean {
  const status = error instanceof ApiError || error instanceof GraphQLRequestError ? error.status : undefined;
  return status !== undefined && status >= 400 && status < 500;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!isClientError(error)) reportError(error, { queryKey: query.queryKey });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
      },
    },
  });
}
