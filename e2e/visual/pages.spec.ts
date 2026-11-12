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

  test("components", async ({ page }) => {
    await page.goto("/components");
    await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
    await expect(page).toHaveScreenshot("components.png", { fullPage: true });
  });
});
