import { expect, test } from "../fixtures";

const pages = [
  { path: "/", heading: /Good|Early|Fresh|Happy|Almost|Working late/ },
  { path: "/contacts", heading: "Contacts" },
  { path: "/design-system", heading: "Design system" },
  { path: "/nowhere", heading: "Page not found" },
];

for (const { path, heading } of pages) {
  test(`${path} has no axe violations`, async ({ page, checkA11y }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    if (path === "/contacts") await expect(page.getByRole("table")).toBeVisible();
    await checkA11y();
  });
}

test.describe("signed-out pages", () => {
  test.use({ signedInAs: null });

  for (const { path, heading } of [
    { path: "/login", heading: "Log in" },
    { path: "/register", heading: "Create your account" },
    { path: "/forgot-password", heading: "Reset your password" },
    { path: "/trial", heading: "Create your account" },
  ]) {
    test(`${path} has no axe violations`, async ({ page, checkA11y }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await checkA11y();
    });
  }
});
