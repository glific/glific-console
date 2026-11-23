import { WalletIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LOW_BALANCE, useWalletBalance } from "./use-wallet-balance";

export function RailBalance() {
  const { t, i18n } = useTranslation();
  const wallet = useWalletBalance();
  if (!wallet.shown) return null;

  const amount =
    wallet.balance === null
      ? null
      : new Intl.NumberFormat(i18n.language, { style: "currency", currency: "USD" }).format(wallet.balance);
  const low = wallet.balance !== null && wallet.balance <= LOW_BALANCE;
  let note: string;
  if (wallet.isLoading) note = t("shell.balance.label");
  else if (amount === null) note = t("shell.balance.unavailable");
  else note = low ? t("shell.balance.low") : t("shell.balance.label");

  return (
    <div
      data-slot="rail-balance"
      title={amount ? t("shell.balance.title", { amount }) : note}
      className="mx-2 flex items-center gap-2.5 rounded-lg p-2.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-0"
    >
      <WalletIcon aria-hidden="true" className="size-5 shrink-0 text-warning" />
      <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:items-center">
        {wallet.isLoading ? (
          <Skeleton className="h-5 w-14" />
        ) : (
          <span className="text-body font-semibold group-data-[collapsible=icon]:text-caption">{amount ?? "—"}</span>
        )}
        <span
          className={cn(
            "truncate text-body-sm group-data-[collapsible=icon]:hidden",
            low || amount === null ? "text-destructive" : "text-warning",
          )}
        >
          {note}
        </span>
      </div>
    </div>
  );
}
