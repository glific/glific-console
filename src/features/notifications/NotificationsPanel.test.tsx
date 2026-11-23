import { screen, within } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

describe("notifications", () => {
  it("shows the unread count, lists recent notifications and marks them read", async () => {
    let marked = 0;
    worker.use(
      glificApi.mutation("MarkNotificationsRead", () => {
        marked += 1;
        return HttpResponse.json({ data: { markNotificationAsRead: true } });
      }),
    );
    renderRoute("/");
    await userEvent.click(await screen.findByRole("button", { name: "Notifications, 2 unread" }));
    const panel = await screen.findByRole("complementary", { name: "Notifications" });
    expect(await within(panel).findByText("Registration flow stopped: the webhook returned an error.")).toBeVisible();
    expect(within(panel).getByRole("img", { name: "Critical" })).toBeVisible();
    expect(within(panel).getByRole("link", { name: "View all notifications" })).toHaveAttribute(
      "href",
      `${location.origin}/notifications`,
    );
    await expect.poll(() => marked).toBe(1);
    expect(await screen.findByRole("button", { name: "Notifications" })).toBeVisible();
    await expectNoA11yViolations();
  });

  it("says when there is nothing to show", async () => {
    worker.use(glificApi.query("RecentNotifications", () => HttpResponse.json({ data: { notifications: [] } })));
    renderRoute("/");
    await userEvent.click(await screen.findByRole("button", { name: /Notifications/ }));
    expect(await screen.findByRole("heading", { name: "No notifications yet" })).toBeVisible();
  });
});
