import { HttpResponse, http } from "msw";
import { contacts } from "./data";

/** Paths are matched against any origin, so handlers work whatever VITE_API_URL points at. */
export const handlers = [http.get("*/contacts", () => HttpResponse.json(contacts))];
