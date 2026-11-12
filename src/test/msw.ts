import { HttpResponse, http } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";

// Minimal emojibase data so the emoji picker never reaches the CDN in tests.
const emojiData = [
  { label: "grinning face", hexcode: "1F600", emoji: "😀", group: 0, order: 1, tags: ["smile"], version: 1 },
  { label: "red heart", hexcode: "2764", emoji: "❤️", group: 0, order: 2, tags: ["love"], version: 1 },
  { label: "thumbs up", hexcode: "1F44D", emoji: "👍", group: 0, order: 3, tags: ["yes"], version: 1 },
];
const emojiMessages = {
  groups: [{ key: "smileys-emotion", message: "smileys & emotion", order: 0 }],
  subgroups: [],
  skinTones: ["light", "medium-light", "medium", "medium-dark", "dark"].map((key) => ({ key, message: key })),
};

const emojiHandlers = [
  http.all("*/emojibase-data*/en/data.json", () => HttpResponse.json(emojiData)),
  http.all("*/emojibase-data*/en/messages.json", () => HttpResponse.json(emojiMessages)),
];

/** Shared worker for component tests. Override per test with `worker.use(...)`. */
export const worker = setupWorker(...handlers, ...emojiHandlers);
