import { useTranslation } from "react-i18next";
import type { NavLinkTarget } from "@/components/NavTargetLink";
import { managers, useAccess } from "@/features/auth/current-user";
import { parseSeverity, useRecentNotifications } from "@/features/notifications/notifications";
import { useOrganization } from "@/features/organization/organization";
import { useWalletBalance } from "@/features/shell/use-wallet-balance";
import { currentAppUrl } from "@/lib/backend";
import { relativeTime } from "./relative-time";

export interface Problem {
  id: string;
  title: string;
  detail?: string;
  action?: { label: string; destination: NavLinkTarget };
}

const LOW_BALANCE = 1;
const SHOWN = 3;

/** Account problems first, then unread critical and warning notifications; worst first, at most three. */
export function useProblems() {
  const { t, i18n } = useTranslation();
  const { can } = useAccess();
  const organization = useOrganization().data;
  const wallet = useWalletBalance();
  const isManager = can(managers);
  const notifications = useRecentNotifications({ enabled: isManager });

  const account: Problem[] = [];
  if (organization?.isSuspended) {
    account.push({ id: "suspended", title: t("home.fix.suspended.title"), detail: t("home.fix.suspended.detail") });
  }
  if (wallet.shown && wallet.balance !== null && wallet.balance <= 0) {
    account.push({ id: "wallet", title: t("home.fix.walletEmpty.title"), detail: t("home.fix.walletEmpty.detail") });
  } else if (wallet.shown && wallet.balance !== null && wallet.balance <= LOW_BALANCE) {
    account.push({ id: "wallet", title: t("home.fix.walletLow.title"), detail: t("home.fix.walletLow.detail") });
  }

  const notificationsPage = { href: currentAppUrl("/notifications") };
  const alerts = (notifications.data ?? [])
    .filter((notification) => !notification.isRead && parseSeverity(notification.severity) !== "info")
    .sort((a, b) => Number(parseSeverity(b.severity) === "critical") - Number(parseSeverity(a.severity) === "critical"))
    .map(
      (notification): Problem => ({
        id: `notification-${notification.id}`,
        title: notification.message ?? "",
        detail: [
          notification.category,
          notification.insertedAt ? relativeTime(notification.insertedAt, i18n.language) : null,
        ]
          .filter(Boolean)
          .join(" · "),
        action: { label: t("home.fix.see"), destination: notificationsPage },
      }),
    );

  const all = [...account, ...alerts];
  return {
    shown: all.slice(0, SHOWN),
    total: all.length,
    allProblems: isManager ? notificationsPage : null,
    isLoading: isManager && notifications.isPending,
  };
}
