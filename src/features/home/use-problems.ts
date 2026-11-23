import { useTranslation } from "react-i18next";
import { managers, useAccess } from "@/features/auth/current-user";
import { parseSeverity, useRecentNotifications } from "@/features/notifications/notifications";
import { useOrganization } from "@/features/organization/organization";
import { LOW_BALANCE, useWalletBalance } from "@/features/shell/use-wallet-balance";
import { relativeTime } from "./relative-time";

export interface Problem {
  id: string;
  title: string;
  detail?: string;
}

const SHOWN = 3;

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
      }),
    );

  const all = [...account, ...alerts];
  return {
    shown: all.slice(0, SHOWN),
    total: all.length,
    isLoading: isManager && notifications.isPending,
  };
}
