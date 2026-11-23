import { type LucideIcon, MoonStarIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";

export type Mood = "morning" | "afternoon" | "evening" | "night";

export interface DayMood {
  mood: Mood;
  icon: LucideIcon;
  greeting: "earlyStart" | "freshWeek" | "weekend" | "morning" | "almostWeekend" | "afternoon" | "evening" | "late";
  withName: boolean;
}

export function dayMood(now = new Date()): DayMood {
  const hour = now.getHours();
  const day = now.getDay();
  const weekend = day === 0 || day === 6;
  if (hour >= 5 && hour < 12) {
    let greeting: DayMood["greeting"] = "morning";
    if (weekend) greeting = "weekend";
    else if (hour < 8) greeting = "earlyStart";
    else if (day === 1) greeting = "freshWeek";
    return { mood: "morning", icon: SunriseIcon, greeting, withName: true };
  }
  if (hour >= 12 && hour < 17) {
    let greeting: DayMood["greeting"] = "afternoon";
    if (weekend) greeting = "weekend";
    else if (day === 5) greeting = "almostWeekend";
    return { mood: "afternoon", icon: SunIcon, greeting, withName: true };
  }
  if (hour >= 17 && hour < 21) return { mood: "evening", icon: SunsetIcon, greeting: "evening", withName: true };
  return { mood: "night", icon: MoonStarIcon, greeting: "late", withName: false };
}
