import { HttpResponse, http } from "msw";
import { authHandlers } from "./auth";
import { contacts } from "./data";

// Any origin, so the handlers answer whichever backend host the app resolves to.
export const handlers = [...authHandlers, http.get("*/api/contacts", () => HttpResponse.json(contacts))];
