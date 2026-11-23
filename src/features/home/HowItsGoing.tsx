import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorState } from "@/components/ErrorState";
import { StatTile } from "@/components/StatTile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeSection } from "./HomeSection";
import { change, type Period, useActivity, useUsage } from "./home-data";

interface Tile {
  id: string;
  label: string;
  value: string;
  trend: number | null;
}

export function HowItsGoing() {
  const { t, i18n } = useTranslation();
  const [days, setDays] = useState<Period>(7);
  const activity = useActivity(days);
  const usage = useUsage(days);
  const number = new Intl.NumberFormat(i18n.language);
  const money = new Intl.NumberFormat(i18n.language, { style: "currency", currency: "USD" });

  let tiles: Tile[] = [];
  if (activity.data) {
    const contacts = activity.data.newContacts ?? 0;
    tiles.push({
      id: "contacts",
      label: t("home.stats.newContacts"),
      value: number.format(contacts),
      trend: change(contacts, activity.data.previousNewContacts ?? 0),
    });
    // Received, sent and spend come from the WhatsApp provider, which the backend shares with admins only.
    if (usage.data) {
      const { current, previous } = usage.data;
      tiles = tiles.concat([
        {
          id: "received",
          label: t("home.stats.received"),
          value: number.format(current.received),
          trend: change(current.received, previous.received),
        },
        {
          id: "sent",
          label: t("home.stats.sent"),
          value: number.format(current.sent),
          trend: change(current.sent, previous.sent),
        },
        {
          id: "spent",
          label: t("home.stats.spent"),
          value: money.format(current.spent),
          trend: change(current.spent, previous.spent),
        },
      ]);
    } else {
      const messages = activity.data.messages ?? 0;
      tiles.push({
        id: "messages",
        label: t("home.stats.messages"),
        value: number.format(messages),
        trend: change(messages, activity.data.previousMessages ?? 0),
      });
    }
  }

  let body: React.ReactNode;
  if (activity.isError) {
    body = <ErrorState title={t("home.stats.error")} onRetry={() => void activity.refetch()} />;
  } else if (activity.isPending || (usage.isFetching && !usage.data && !usage.isError)) {
    body = (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {["a", "b", "c", "d"].map((key) => (
          <Skeleton key={key} className="h-24" />
        ))}
      </div>
    );
  } else {
    body = (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile key={tile.id} label={tile.label} value={tile.value} trend={tile.trend ?? undefined} />
        ))}
      </div>
    );
  }

  return (
    <HomeSection
      title={t("home.stats.title")}
      aside={
        <>
          <Select value={String(days)} onValueChange={(value) => setDays(Number(value) as Period)}>
            <SelectTrigger size="sm" aria-label={t("home.stats.period")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("home.stats.last7")}</SelectItem>
              <SelectItem value="30">{t("home.stats.last30")}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      {body}
    </HomeSection>
  );
}
