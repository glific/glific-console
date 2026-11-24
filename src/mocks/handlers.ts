import { authHandlers } from "./auth";
import { contactsHandlers } from "./contacts";
import { glificAiHandlers } from "./glific-ai";
import { notificationsHandlers } from "./notifications";
import { organizationHandlers } from "./organization";
import { userHandlers } from "./user";

export { glificApi } from "./api";
export { currentUserWithRoles, languages } from "./user";

/** Every feature's mocks. Add a file per feature (src/mocks/<feature>.ts) and register it here. */
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...organizationHandlers,
  ...notificationsHandlers,
  ...glificAiHandlers,
  ...contactsHandlers,
];
