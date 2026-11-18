import { expect, test } from "../fixtures";

test.describe("app shell", () => {
  test("rail, account menu and right panel for a Glific admin", async ({ page, checkA11y }) => {
    await page.goto("/");
    const rail = page.getByRole("navigation", { name: "Main" });
    await expect(rail.getByRole("link")).toHaveText([
      "Home",
      "Chats",
      "Flows",
      "Library",
      "AI assistants",
      "Analytics",
      "Contacts",
    ]);
    await expect(rail.getByRole("link", { name: "Flows" })).toHaveAttribute("href", /\/flow$/);

    await page.getByRole("button", { name: /account and settings/ }).click();
    await expect(page.getByRole("menuitem", { name: "Organizations" })).toBeVisible();
    await page.keyboard.press("Escape");

    await page
      .getByRole("navigation", { name: "Apps" })
      .getByRole("button", { name: /Notifications/ })
      .click();
    const panel = page.getByRole("complementary", { name: "Notifications" });
    await expect(panel.getByRole("link", { name: "View all notifications" })).toBeVisible();
    await checkA11y();
    await panel.getByRole("button", { name: "Close Notifications" }).click();
    await expect(panel).toHaveCount(0);
  });

  test.describe("as staff", () => {
    test.use({ signedInAs: "staff" });

    test("shows only the sections staff can open", async ({ page }) => {
      await page.goto("/contacts");
      const rail = page.getByRole("navigation", { name: "Main" });
      await expect(rail.getByRole("link")).toHaveText(["Home", "Chats", "Analytics", "Contacts"]);
      await expect(page.getByRole("navigation", { name: "Sections in Contacts" })).toBeVisible();
      await page.getByRole("button", { name: /account and settings/ }).click();
      await expect(page.getByRole("menuitem", { name: "Settings" })).toHaveCount(0);
    });
  });
});
