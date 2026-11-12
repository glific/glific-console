import { expect, test } from "../fixtures";

// Baselines are generated in the official Playwright Docker image: run `pnpm test:visual:update`.
test.describe("visual @visual", () => {
  test("home", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot("home.png", { fullPage: true });
  });

  test("contacts", async ({ page }) => {
    await page.goto("/contacts");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page).toHaveScreenshot("contacts.png", { fullPage: true });
  });

  test("design-system", async ({ page }) => {
    await page.goto("/design-system");
    await expect(page.getByRole("heading", { level: 1, name: "Design system" })).toBeVisible();
    await expect(page).toHaveScreenshot("design-system.png", { fullPage: true });
  });
});
