import { HttpResponse } from "msw";
import { glificApi, glificSocket } from "./api";

export const glificAiHandlers = [
  glificSocket("AskGlificResponse", () => {}),
  glificApi.mutation("AskGlific", () => HttpResponse.json({ data: { askGlific: { errors: null } } })),
  glificApi.mutation("AskGlificFeedback", () => HttpResponse.json({ data: { askGlificFeedback: { success: true } } })),
];
