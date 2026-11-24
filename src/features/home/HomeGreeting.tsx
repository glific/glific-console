import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { DayMood } from "./day-mood";

const iconColour = {
  morning: "text-mood-morning",
  afternoon: "text-mood-afternoon",
  evening: "text-mood-evening",
  night: "text-mood-night",
} as const;

interface HomeGreetingProps {
  mood: DayMood;
  firstName: string;
  summary: string | null;
}

export function HomeGreeting({ mood, firstName, summary }: HomeGreetingProps) {
  const { t, i18n } = useTranslation();
  const Icon = mood.icon;
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: "long" }).format(new Date());
  const greeting = t(`home.greeting.${mood.greeting}`, { weekday });
  return (
    <div className="flex flex-col items-center gap-inline text-center">
      <h1 className="flex items-center gap-3 text-display">
        <Icon aria-hidden="true" className={cn("size-7 shrink-0", iconColour[mood.mood])} />
        {mood.withName && firstName ? t("home.greeting.withName", { greeting, name: firstName }) : greeting}
      </h1>
      {summary ? <p className="text-subheading font-normal text-muted-foreground">{summary}</p> : null}
    </div>
  );
}
