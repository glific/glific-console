import { HttpResponse } from "msw";
import { graphql } from "msw/graphql";
import { authHandlers } from "./auth";
import { contacts } from "./data";

function matches(term: string | undefined, name: string, phone: string) {
  const query = term?.trim().toLowerCase();
  return !query || name.toLowerCase().includes(query) || phone.includes(query);
}

// Any origin, so the handlers answer whichever backend host the app resolves to.
export const glificApi = graphql.link("*/api");

export const handlers = [
  ...authHandlers,
  // Glific admin in mock mode, so the internal /design-system page is reachable while developing.
  glificApi.query("CurrentUser", () =>
    HttpResponse.json({
      data: { currentUser: { user: { id: "1", name: "Glific Team", roles: ["Glific_admin"] } } },
    }),
  ),
  glificApi.query("Contacts", ({ variables }) => {
    const filter = (variables.filter ?? {}) as { term?: string };
    const opts = (variables.opts ?? {}) as { limit?: number; offset?: number };
    const found = contacts.filter((contact) => matches(filter.term, contact.name, contact.maskedPhone));
    const offset = opts.offset ?? 0;
    return HttpResponse.json({
      data: { contacts: found.slice(offset, offset + (opts.limit ?? found.length)), countContacts: found.length },
    });
  }),
];
