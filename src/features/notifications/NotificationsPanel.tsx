import { BellOffIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { StatusDot } from "@/components/StatusDot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { currentAppUrl } from "@/lib/backend";
import { parseSeverity, type Severity, useMarkNotificationsRead, useRecentNotifications } from "./notifications";

const tones = { critical: "danger", warning: "warning", info: "info" } as const satisfies Record<Severity, string>;

export function NotificationsPanel() {
  const { t, i18n } = useTranslation();
  const notifications = useRecentNotifications();
  const markRead = useMarkNotificationsRead();
  const { mutate } = markRead;
  const hasUnread = notifications.data?.some((notification) => !notification.isRead) ?? false;

  useEffect(() => {
    if (hasUnread) mutate();
  }, [hasUnread, mutate]);

  const time = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" });

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
      <ul className="flex flex-col divide-y">
        {notifications.data.map((notification) => {
          const severity = parseSeverity(notification.severity);
          return (
            <li key={notification.id} className="flex gap-inline px-stack py-3">
              <StatusDot tone={tones[severity]} label={t(`notifications.severity.${severity}`)} className="mt-1.5" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-body">{notification.message}</p>
                <p className="text-body-sm text-muted-foreground">
                  {[
                    notification.category,
                    notification.insertedAt ? time.format(new Date(notification.insertedAt)) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
      <div className="border-t p-stack">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={currentAppUrl("/notifications")}>{t("notifications.viewAll")}</a>
        </Button>
      </div>
    </div>
  );
}
