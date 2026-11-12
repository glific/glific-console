import { expect, test } from "../fixtures";

test.describe("contacts", () => {
  test("navigates from home to contacts and searches", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Home" })).toBeVisible();

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contacts" }).click();
    await expect(page).toHaveURL(/\/contacts$/);
    await expect(page.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(26);
    await expect(page.getByText("60 results")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Page 2 of 3")).toBeVisible();

    await page.getByRole("searchbox", { name: "Search contacts" }).fill("rahul");
    await expect(page.getByText("6 results")).toBeVisible();
    await expect(page.getByRole("cell", { name: "Rahul Verma", exact: true })).toBeVisible();

    await page.getByRole("searchbox", { name: "Search contacts" }).fill("nobody");
    await expect(page.getByRole("heading", { name: "No matching contacts" })).toBeVisible();
  });

  test("is fully keyboard operable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Home" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Contacts" })).toBeFocused();
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
