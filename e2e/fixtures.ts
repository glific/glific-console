import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

export type Theme = "light" | "dark";

/** Pin the theme before the app boots (the app reads it from localStorage). */
export async function useTheme(page: Page, theme: Theme): Promise<void> {
  await page.addInitScript((value) => {
    try {
      localStorage.setItem("glific-console:theme", value);
    } catch {}
  }, theme);
}

export const test = base.extend<{ checkA11y: () => Promise<void> }>({
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
