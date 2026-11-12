import AxeBuilder from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

interface Fixtures {
  /** Start each test with a valid session in localStorage. Turn off with test.use({ signedIn: false }). */
  signedIn: boolean;
  checkA11y: () => Promise<void>;
}

export const test = base.extend<Fixtures>({
  signedIn: [true, { option: true }],
  page: async ({ page, signedIn }, use) => {
    if (signedIn) {
      await page.addInitScript(() => {
        if (localStorage.getItem("glific_session")) return;
        const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        localStorage.setItem(
          "glific_session",
          JSON.stringify({ access_token: "access-e2e", renewal_token: "renewal-e2e", token_expiry_time: expiry }),
        );
      });
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
