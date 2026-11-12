import { expect, test } from "../fixtures";

test.describe("sign in and out", () => {
  test.use({ signedIn: false });

  test("redirects to login, signs in and returns to the requested page", async ({ page }) => {
    await page.goto("/contacts");
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Phone number").fill("919876543210");
    await page.getByLabel("Password", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toContainText("Invalid phone or password");

    await page.getByLabel("Password", { exact: true }).fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/contacts$/);
    await expect(page.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();

    await page.getByRole("link", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("login page has no axe violations", async ({ page, checkA11y }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "Sign in to Glific" })).toBeVisible();
    await checkA11y();
  });
});
