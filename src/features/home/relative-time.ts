const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "4 hours ago", "in 2 days": the largest whole unit, in the user's language. */
export function relativeTime(iso: string, locale: string, now = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size || unit === "minute") return format.format(Math.round(diff / size), unit);
  }
  return format.format(0, "minute");
}
