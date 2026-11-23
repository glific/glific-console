import { BellOffIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { currentAppUrl } from "@/lib/backend";
import { NotificationCard } from "./NotificationCard";
import { groupByDay, useMarkNotificationsRead, useRecentNotifications } from "./notifications";

export function NotificationsPanel() {
  const { t, i18n } = useTranslation();
  const notifications = useRecentNotifications();
  const markRead = useMarkNotificationsRead();
  const { mutate } = markRead;
  const hasUnread = notifications.data?.some((notification) => !notification.isRead) ?? false;

  useEffect(() => {
    if (hasUnread) mutate();
  }, [hasUnread, mutate]);

  const dayLabel = (day: string) => {
    const date = new Date(`${day}T00:00`);
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return t("notifications.today");
    if (date.toDateString() === yesterday.toDateString()) return t("notifications.yesterday");
    return new Intl.DateTimeFormat(i18n.language, { weekday: "short", day: "numeric", month: "short" }).format(date);
  };

  let body: ReactNode;
  if (notifications.isPending) {
    body = (
      <div className="flex flex-col gap-stack p-stack">
        {["a", "b", "c"].map((key) => (
          <Skeleton key={key} className="h-12 w-full" />
        ))}
      </div>
    );
  } else if (notifications.isError) {
    body = <ErrorState title={t("notifications.error")} onRetry={() => void notifications.refetch()} />;
  } else if (notifications.data.length === 0) {
    body = <EmptyState icon={<BellOffIcon />} title={t("notifications.empty")} />;
  } else {
    body = (
      <div className="flex flex-col gap-stack p-stack">
        {groupByDay(notifications.data).map(({ day, items }) => (
          <section key={day} aria-label={dayLabel(day)} className="flex flex-col gap-inline">
            <h3 className="text-body-sm font-medium text-muted-foreground">{dayLabel(day)}</h3>
            <ul className="flex flex-col gap-inline">
              {items.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted">{body}</div>
      <div className="border-t p-stack">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={currentAppUrl("/notifications")}>{t("notifications.viewAll")}</a>
        </Button>
      </div>
    </div>
  );
}
