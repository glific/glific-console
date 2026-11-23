import { HttpResponse } from "msw";
import { glificApi } from "./api";

export const notificationsHandlers = [
  glificApi.query("UnreadNotifications", () => HttpResponse.json({ data: { countNotifications: 2 } })),
  glificApi.query("RecentNotifications", () =>
    HttpResponse.json({
      data: {
        notifications: [
          {
            id: "1",
            category: "Flow",
            message: "Registration flow stopped: the webhook returned an error.",
            severity: '"Critical"',
            isRead: false,
            insertedAt: "2026-11-17T10:00:00Z",
          },
          {
            id: "2",
            category: "Templates",
            message: "Template order_update was approved.",
            severity: '"Info"',
            isRead: true,
            insertedAt: "2026-11-16T08:30:00Z",
          },
        ],
      },
    }),
  ),
  glificApi.mutation("MarkNotificationsRead", () => HttpResponse.json({ data: { markNotificationAsRead: true } })),
];
