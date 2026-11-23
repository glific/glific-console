import { screen, within } from "@testing-library/react";
import { HttpResponse } from "msw";
import { createGraphQLSubscriptionHandler } from "msw/graphql";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

const socket = createGraphQLSubscriptionHandler("*/socket");

function answerOverSocket() {
  const asked: { query: string; requestId: string }[] = [];
  let publish: ((payload: unknown) => void) | null = null;
  worker.use(
    glificApi.mutation("AskGlific", ({ variables }) => {
      asked.push(variables.input);
      return HttpResponse.json({ data: { askGlific: { errors: null } } });
    }),
    socket("AskGlificResponse", ({ subscription }) => {
      publish = (payload) => subscription.publish({ data: { askGlificResponse: payload } });
    }),
  );
  return {
    asked,
    reply: async (payload: Record<string, unknown>) => {
      await expect.poll(() => publish !== null && asked.length > 0).toBe(true);
      publish?.({ conversationId: "c1", errors: null, requestId: asked.at(-1)?.requestId, ...payload });
    },
  };
}

describe("Glific AI", () => {
  it("asks from the panel and shows the answer that comes back over the socket", async () => {
    const backend = answerOverSocket();
    renderRoute("/contacts");
    await userEvent.click(await screen.findByRole("button", { name: "Glific AI" }));
    const panel = await screen.findByRole("complementary", { name: "Glific AI" });
    await userEvent.fill(
      await within(panel).findByRole("textbox", { name: "Ask Glific AI" }),
      "How do I add a contact?",
    );
    await userEvent.keyboard("{Enter}");
    expect(await within(panel).findByText("How do I add a contact?")).toBeVisible();
    await expect
      .poll(() => backend.asked[0])
      .toMatchObject({ query: "How do I add a contact?", pageUrl: location.href });

    await backend.reply({ answer: "Open Contacts and choose Add contact.", messageId: "m1" });
    expect(await within(panel).findByText("Open Contacts and choose Add contact.")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("ignores answers meant for another tab, and records feedback", async () => {
    let feedback: unknown;
    const backend = answerOverSocket();
    worker.use(
      glificApi.mutation("AskGlificFeedback", ({ variables }) => {
        feedback = variables.input;
        return HttpResponse.json({ data: { askGlificFeedback: { success: true } } });
      }),
    );
    renderRoute("/contacts");
    await userEvent.click(await screen.findByRole("button", { name: "Glific AI" }));
    const panel = await screen.findByRole("complementary", { name: "Glific AI" });
    await userEvent.click(await within(panel).findByRole("button", { name: "How do I use Google Sheets in my flow?" }));

    await expect.poll(() => backend.asked.length).toBe(1);
    await backend.reply({ answer: "Not for you", requestId: "other-tab" });
    await backend.reply({ answer: "Use the Google Sheets action.", messageId: "m2" });
    expect(await within(panel).findByText("Use the Google Sheets action.")).toBeVisible();
    expect(within(panel).queryByText("Not for you")).toBeNull();

    await userEvent.click(within(panel).getByRole("button", { name: "Helpful" }));
    expect(within(panel).getByRole("button", { name: "Helpful" })).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => feedback).toEqual({ messageId: "m2", rating: "like" });
  });

  it("shows an error when the question can't be sent", async () => {
    worker.use(glificApi.mutation("AskGlific", () => HttpResponse.json({ errors: [{ message: "AI is down" }] })));
    renderRoute("/contacts");
    await userEvent.click(await screen.findByRole("button", { name: "Glific AI" }));
    const panel = await screen.findByRole("complementary", { name: "Glific AI" });
    await userEvent.fill(await within(panel).findByRole("textbox", { name: "Ask Glific AI" }), "Hello");
    await userEvent.keyboard("{Enter}");
    expect(await within(panel).findByRole("alert")).toHaveTextContent("AI is down");
  });
});
