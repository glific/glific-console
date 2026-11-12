import { expect, test } from "../fixtures";

const pages = [
  { path: "/", heading: "Home" },
  { path: "/contacts", heading: "Contacts" },
  { path: "/components", heading: "Components" },
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
