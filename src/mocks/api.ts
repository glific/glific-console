import { createGraphQLSubscriptionHandler, graphql } from "msw/graphql";

// Any origin, so the handlers answer whichever backend host the app resolves to.
export const glificApi = graphql.link("*/api");
// Live updates stay silent unless a test publishes them.
export const glificSocket = createGraphQLSubscriptionHandler("*/socket");
