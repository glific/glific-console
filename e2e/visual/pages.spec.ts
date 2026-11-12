import { expect, type Theme, test, useTheme } from "../fixtures";

// Baselines are generated in the official Playwright Docker image: run `pnpm test:visual:update`.
test.describe("visual @visual", () => {
  for (const theme of ["light", "dark"] satisfies Theme[]) {
    test(`home (${theme})`, async ({ page }) => {
      await useTheme(page, theme);
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page).toHaveScreenshot(`home-${theme}.png`, { fullPage: true });
    });

    test(`contacts (${theme})`, async ({ page }) => {
      await useTheme(page, theme);
      await page.goto("/contacts");
      await expect(page.getByRole("table")).toBeVisible();
      await expect(page).toHaveScreenshot(`contacts-${theme}.png`, { fullPage: true });
    });
  }
});
