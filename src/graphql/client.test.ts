import { HttpResponse, http } from "msw";
import { createGraphQLSubscriptionHandler } from "msw/graphql";
import { describe, expect, it, vi } from "vitest";
import { getSession, setSession } from "@/lib/session";
import { mockSession } from "@/mocks/auth";
import { glificApi } from "@/mocks/handlers";
import { worker } from "@/test/msw";
import { GraphQLRequestError, request } from "./client";
import { TypedDocumentString } from "./generated/graphql";
import { subscribe } from "./subscriptions";

const Ping = new TypedDocumentString<{ ping: string }, Record<string, never>>("query Ping { ping }");

describe("GraphQL request", () => {
  it("sends the query with the access token and returns data", async () => {
    let authorization: string | null = null;
    worker.use(
      glificApi.query("Ping", ({ request: req }) => {
        authorization = req.headers.get("authorization");
        return HttpResponse.json({ data: { ping: "pong" } });
      }),
    );
    setSession(mockSession());
    await expect(request(Ping)).resolves.toEqual({ ping: "pong" });
    expect(authorization).toBe(getSession()?.access_token);
  });

  it("throws GraphQL errors and signs out on 401", async () => {
    worker.use(
      glificApi.query("Ping", () => HttpResponse.json({ errors: [{ message: "Unauthorized", path: ["ping"] }] })),
    );
    await expect(request(Ping)).rejects.toMatchObject({ name: "GraphQLRequestError", message: "Unauthorized" });

    setSession(mockSession());
    worker.use(http.post("*/api", () => HttpResponse.json({ error: "expired" }, { status: 401 })));
    const error = await request(Ping).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(GraphQLRequestError);
    expect((error as GraphQLRequestError).status).toBe(401);
    expect(getSession()).toBeNull();
  });
});

describe("GraphQL subscriptions", () => {
  it("receives published messages over graphql-transport-ws with the auth token", async () => {
    setSession(mockSession());
    const subscription = createGraphQLSubscriptionHandler("*/socket");
    worker.use(
      subscription("ReceivedMessage", ({ subscription: sub }) => {
        sub.publish({ data: { receivedMessage: { id: "m1", body: "Hi" } } });
      }),
    );
    const ReceivedMessage = new TypedDocumentString<
      { receivedMessage: { id: string; body: string } },
      { organizationId: string }
    >(
      "subscription ReceivedMessage($organizationId: ID!) { receivedMessage(organizationId: $organizationId) { id body } }",
    );
    const next = vi.fn();
    const unsubscribe = subscribe(ReceivedMessage, { organizationId: "1" }, { next });
    await expect.poll(() => next.mock.calls.length, { timeout: 5000 }).toBe(1);
    expect(next).toHaveBeenCalledWith({ receivedMessage: { id: "m1", body: "Hi" } });
    unsubscribe();
  });
});
