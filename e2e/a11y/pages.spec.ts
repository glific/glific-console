import { expect, type Theme, test, useTheme } from "../fixtures";

const pages = [
  { path: "/", heading: "Home" },
  { path: "/contacts", heading: "Contacts" },
  { path: "/nowhere", heading: "Page not found" },
];

for (const theme of ["light", "dark"] satisfies Theme[]) {
  for (const { path, heading } of pages) {
    test(`${path} has no axe violations (${theme})`, async ({ page, checkA11y }) => {
      await useTheme(page, theme);
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      if (path === "/contacts") await expect(page.getByRole("table")).toBeVisible();
      await checkA11y();
    });
  }
}
