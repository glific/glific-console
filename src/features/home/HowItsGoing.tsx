import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatTile } from "@/components/StatTile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeSection } from "./HomeSection";
import { type Period, placeholderStats } from "./placeholder-data";

const labels = {
  contacts: "home.stats.newContacts",
  received: "home.stats.received",
  sent: "home.stats.sent",
  spent: "home.stats.spent",
} as const;

export function HowItsGoing() {
  const { t, i18n } = useTranslation();
  const [days, setDays] = useState<Period>(7);
  const number = new Intl.NumberFormat(i18n.language);
  const money = new Intl.NumberFormat(i18n.language, { style: "currency", currency: "USD" });

  return (
    <HomeSection
      title={t("home.stats.title")}
      aside={
        <Select value={String(days)} onValueChange={(value) => setDays(Number(value) as Period)}>
          <SelectTrigger size="sm" aria-label={t("home.stats.period")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t("home.stats.last7")}</SelectItem>
            <SelectItem value="30">{t("home.stats.last30")}</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="flex flex-col gap-inline">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {placeholderStats[days].map((stat) => (
            <StatTile
              key={stat.id}
              label={t(labels[stat.id])}
              value={stat.id === "spent" ? money.format(stat.value) : number.format(stat.value)}
              trend={stat.trend}
            />
          ))}
        </div>
        <p className="text-body-sm text-muted-foreground">{t("home.stats.sample")}</p>
      </div>
    </HomeSection>
  );
}
