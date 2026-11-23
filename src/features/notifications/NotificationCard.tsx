import { useTranslation } from "react-i18next";
import { StatusDot } from "@/components/StatusDot";
import { type Notification, parseSeverity, type Severity } from "./notifications";

const tones = { critical: "danger", warning: "warning", info: "info" } as const satisfies Record<Severity, string>;

export function NotificationCard({ notification }: { notification: Notification }) {
  const { t, i18n } = useTranslation();
  const severity = parseSeverity(notification.severity);
  const time = notification.insertedAt
    ? new Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit" }).format(
        new Date(notification.insertedAt),
      )
    : null;
  return (
    <li className="flex gap-inline rounded-xl bg-background p-3">
      <StatusDot
        tone={notification.isRead ? "neutral" : tones[severity]}
        label={t(`notifications.severity.${severity}`)}
        className="mt-1.5"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-inline">
          <p className="text-body font-medium">{notification.message}</p>
          {time ? <time className="shrink-0 text-body-sm text-muted-foreground">{time}</time> : null}
        </div>
        {notification.category ? <p className="text-body-sm text-muted-foreground">{notification.category}</p> : null}
      </div>
    </li>
  );
}
