import { HttpResponse } from "msw";
import { createGraphQLSubscriptionHandler, graphql } from "msw/graphql";
import { authHandlers } from "./auth";
import { contacts } from "./data";

function matches(term: string | undefined, name: string, phone: string) {
  const query = term?.trim().toLowerCase();
  return !query || name.toLowerCase().includes(query) || phone.includes(query);
}

export const languages = [
  { id: "1", label: "English", labelLocale: "English", locale: "en", localized: true },
  { id: "2", label: "Hindi", labelLocale: "हिंदी", locale: "hi", localized: true },
  { id: "3", label: "Marathi", labelLocale: "मराठी", locale: "mr", localized: false },
];

// Any origin, so the handlers answer whichever backend host the app resolves to.
export const glificApi = graphql.link("*/api");
const glificSocket = createGraphQLSubscriptionHandler("*/socket");

/** Signs the mock user in with these access-role labels, e.g. ["Staff"] or ["Admin"]. */
export function currentUserWithRoles(roles: string[]) {
  return glificApi.query("CurrentUser", () =>
    HttpResponse.json({
      data: {
        currentUser: {
          user: {
            id: "2",
            name: "NGO user",
            accessRoles: roles.map((label) => ({ label })),
            language: { locale: "en" },
            organization: { id: "1", activeLanguages: languages },
          },
        },
      },
    }),
  );
}

export const handlers = [
  // Live updates stay silent unless a test publishes them.
  glificSocket("WalletBalanceUpdated", () => {}),
  glificSocket("AskGlificResponse", () => {}),
  ...authHandlers,
  // Glific admin in mock mode, so the internal /design-system page is reachable while developing.
  glificApi.query("CurrentUser", () =>
    HttpResponse.json({
      data: {
        currentUser: {
          user: {
            id: "1",
            name: "Glific Team",
            accessRoles: [{ label: "Glific_admin" }],
            language: { locale: "en" },
            organization: { id: "1", activeLanguages: languages },
          },
        },
      },
    }),
  ),
  glificApi.query("Organization", () =>
    HttpResponse.json({
      data: {
        organization: {
          organization: {
            id: "1",
            name: "Glific",
            isTrialOrg: false,
            isSuspended: false,
            bsp: { shortcode: "gupshup" },
          },
        },
      },
    }),
  ),
  glificApi.query("OrganizationServices", () =>
    HttpResponse.json({
      data: {
        organizationServices: {
          askGlificEnabled: true,
          glificAiEnabled: false,
          certificateEnabled: false,
          rolesAndPermission: false,
          ticketingEnabled: false,
          whatsappFormsEnabled: true,
          whatsappGroupEnabled: false,
        },
      },
    }),
  ),
  glificApi.query("WalletBalance", () => HttpResponse.json({ data: { bspbalance: '{"balance":12.5}' } })),
  glificApi.query("UnreadNotifications", () => HttpResponse.json({ data: { countNotifications: 2 } })),
  glificApi.query("RecentNotifications", () =>
    HttpResponse.json({
      data: {
        notifications: [
          {
            id: "1",
            category: "Flow",
            message: "Registration flow stopped: the webhook returned an error.",
            severity: '"Critical"',
            isRead: false,
            insertedAt: "2026-11-17T10:00:00Z",
          },
          {
            id: "2",
            category: "Templates",
            message: "Template order_update was approved.",
            severity: '"Info"',
            isRead: true,
            insertedAt: "2026-11-16T08:30:00Z",
          },
        ],
      },
    }),
  ),
  glificApi.mutation("MarkNotificationsRead", () => HttpResponse.json({ data: { markNotificationAsRead: true } })),
  glificApi.mutation("AskGlific", () => HttpResponse.json({ data: { askGlific: { errors: null } } })),
  glificApi.mutation("AskGlificFeedback", () => HttpResponse.json({ data: { askGlificFeedback: { success: true } } })),
  glificApi.mutation("UpdateLanguage", () =>
    HttpResponse.json({ data: { updateCurrentUser: { user: { id: "1" }, errors: null } } }),
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
