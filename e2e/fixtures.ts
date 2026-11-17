import AxeBuilder from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

export const BACKEND_URL = process.env.E2E_BACKEND_URL ?? "https://api.glific.test:4001";

/** Users created by the backend's dev seeds (`mix setup`). */
export const users = {
  glificAdmin: { phone: "919900000001", password: "Secret12345678!" },
  staff: { phone: "919820112345", password: "Secret12345678!" },
} as const;

type UserKey = keyof typeof users;
type Session = { access_token: string; renewal_token: string; token_expiry_time: string };

interface TestFixtures {
  signedInAs: UserKey | null;
  checkA11y: () => Promise<void>;
}

interface WorkerFixtures {
  sessionFor: (user: UserKey) => Promise<Session>;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // One login per user per worker, so tests stay under the backend's login rate limit.
  sessionFor: [
    async ({ playwright }, use) => {
      const api = await playwright.request.newContext({ baseURL: BACKEND_URL, ignoreHTTPSErrors: true });
      const sessions = new Map<UserKey, Promise<Session>>();
      await use((user) => {
        let session = sessions.get(user);
        if (!session) {
          session = api.post("/api/v1/session", { data: { user: users[user] } }).then(async (response) => {
            expect(response.ok(), `seed user "${user}" signs in`).toBe(true);
            return ((await response.json()) as { data: Session }).data;
          });
          sessions.set(user, session);
        }
        return session;
      });
      await api.dispose();
    },
    { scope: "worker" },
  ],
  signedInAs: ["glificAdmin", { option: true }],
  page: async ({ page, signedInAs, sessionFor }, use) => {
    if (signedInAs) {
      const session = JSON.stringify(await sessionFor(signedInAs));
      await page.addInitScript((value) => {
        if (!localStorage.getItem("glific_session")) localStorage.setItem("glific_session", value);
      }, session);
    }
    await use(page);
  },
  checkA11y: async ({ page }, use) => {
    await use(async () => {
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(" ")).join("\n    ")}`,
      );
      expect(summary, "axe violations").toEqual([]);
    });
  },
});

export { expect };
