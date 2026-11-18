import { expect, test } from "../fixtures";

test.describe("contacts", () => {
  test("navigates from home to contacts and searches", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Home" })).toBeVisible();

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contacts" }).click();
    await expect(page).toHaveURL(/\/contacts$/);
    await expect(page.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Adelle Cavin", exact: true })).toBeVisible();

    await page.getByRole("searchbox", { name: "Search contacts" }).fill("Margarita");
    await expect(page.getByRole("cell", { name: "Margarita Quinteros", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Adelle Cavin", exact: true })).toHaveCount(0);

    await page.getByRole("searchbox", { name: "Search contacts" }).fill("no-such-contact-e2e");
    await expect(page.getByRole("heading", { name: "No matching contacts" })).toBeVisible();
  });

  test("is fully keyboard operable", async ({ page }) => {
    await page.goto("/");
    const contacts = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contacts" });
    // The nav links render once the user's roles load, which can be after the page heading.
    await expect(contacts).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    // Through the menu toggle and every section before Contacts in the rail.
    const focused = () => contacts.evaluate((link) => link === link.ownerDocument.activeElement);
    for (let step = 0; step < 12 && !(await focused()); step++) {
      await page.keyboard.press("Tab");
    }
    await expect(contacts).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/contacts$/);
  });
});

test.describe("app shell", () => {
  test("shows the 404 page and links home", async ({ page }) => {
    await page.goto("/nowhere");
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await page.getByRole("link", { name: "Go to home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
