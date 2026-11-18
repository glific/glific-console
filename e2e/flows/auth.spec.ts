import { expect, test, users } from "../fixtures";

test.describe("sign in and out", () => {
  test.use({ signedInAs: null });

  test("redirects to login, signs in and returns to the requested page", async ({ page }) => {
    await page.goto("/contacts");
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Phone number").fill(users.glificAdmin.phone);
    await page.getByLabel("Password", { exact: true }).fill("not-the-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert")).toContainText("Invalid phone or password");

    await page.getByLabel("Password", { exact: true }).fill(users.glificAdmin.password);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/contacts$/);
    await expect(page.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();

    await page.getByRole("button", { name: /account and settings/ }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("roles", () => {
  test.use({ signedInAs: "staff" });

  test("staff cannot see or open the design system", async ({ page }) => {
    await page.goto("/design-system");
    // The 404 appears only once the user's roles have loaded, so the nav check below is meaningful.
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Contacts" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Design system" })).toHaveCount(0);
  });
});
