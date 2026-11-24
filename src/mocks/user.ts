import { HttpResponse } from "msw";
import { glificApi } from "./api";

export const languages = [
  { id: "1", label: "English", labelLocale: "English", locale: "en", localized: true },
  { id: "2", label: "Hindi", labelLocale: "हिंदी", locale: "hi", localized: true },
  { id: "3", label: "Marathi", labelLocale: "मराठी", locale: "mr", localized: false },
];

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

export const userHandlers = [
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
  glificApi.mutation("UpdateLanguage", () =>
    HttpResponse.json({ data: { updateCurrentUser: { user: { id: "1" }, errors: null } } }),
  ),
];
