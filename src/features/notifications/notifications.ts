import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managers, useAccess } from "@/features/auth/current-user";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";

const UnreadNotificationsQuery = graphql(`
  query UnreadNotifications {
    countNotifications(filter: { isRead: false })
  }
`);

const RecentNotificationsQuery = graphql(`
  query RecentNotifications($opts: Opts) {
    notifications(opts: $opts) {
      id
      category
      message
      severity
      isRead
      insertedAt
    }
  }
`);

const MarkNotificationsRead = graphql(`
  mutation MarkNotificationsRead {
    markNotificationAsRead
  }
`);

export type Severity = "critical" | "warning" | "info";
const RECENT_LIMIT = 20;
const notificationsKey = ["notifications"] as const;

// The backend stores severity as a JSON-encoded string, e.g. "\"Critical\"".
export function parseSeverity(raw: unknown): Severity {
  const value = String(raw ?? "")
    .replace(/"/g, "")
    .toLowerCase();
  return value === "critical" || value === "warning" ? value : "info";
}

/** Unread count for the badge; notifications are a manager-level page in the current app. */
export function useUnreadNotifications() {
  const { can } = useAccess();
  const allowed = can(managers);
  const count = useQuery({
    queryKey: [...notificationsKey, "unread"],
    queryFn: async () => (await request(UnreadNotificationsQuery)).countNotifications ?? 0,
    enabled: allowed,
    refetchInterval: 5 * 60_000,
  });
  return allowed ? (count.data ?? 0) : 0;
}

export function useRecentNotifications({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryKey: [...notificationsKey, "recent"],
    queryFn: async () =>
      (
        (
          await request(RecentNotificationsQuery, {
            opts: { limit: RECENT_LIMIT, order: "DESC", orderWith: "updated_at" },
          })
        ).notifications ?? []
      ).flatMap((notification) => (notification?.id ? [notification] : [])),
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => request(MarkNotificationsRead),
    onSuccess: () => queryClient.setQueryData([...notificationsKey, "unread"], 0),
  });
}

export type Notification = NonNullable<ReturnType<typeof useRecentNotifications>["data"]>[number];

/** Newest day first, each day's notifications in the order given; `day` is the local date (YYYY-MM-DD). */
export function groupByDay(notifications: readonly Notification[]) {
  const groups = new Map<string, Notification[]>();
  for (const notification of notifications) {
    if (!notification.insertedAt) continue;
    const at = new Date(notification.insertedAt);
    const day = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}-${String(at.getDate()).padStart(2, "0")}`;
    groups.set(day, [...(groups.get(day) ?? []), notification]);
  }
  return [...groups].map(([day, items]) => ({ day, items }));
}
