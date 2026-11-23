import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

// The current app's "Schedule call" link for trial organisations.
const TALK_TO_US = "https://calendar.app.google/USJMfhSsDvW5yS6B7";

/** The trial's days left, and a way to talk to the Glific team about going live. */
export function TrialStrip({ daysLeft }: { daysLeft: number | null }) {
  const { t } = useTranslation();
  return (
    <a
      href={TALK_TO_US}
      target="_blank"
      rel="noreferrer"
      className="mx-auto flex h-11 w-fit items-center gap-3 rounded-full border bg-background pr-4 pl-5 text-body font-semibold shadow-sm hover:bg-accent"
    >
      {t("home.trial.goLive")}
      {daysLeft !== null ? (
        <span className="font-normal text-muted-foreground">
          {daysLeft > 0 ? t("home.trial.daysLeft", { count: daysLeft }) : t("home.trial.ended")}
        </span>
      ) : null}
      <ArrowRightIcon aria-hidden="true" className="size-4 text-primary" />
      <span className="sr-only">{t("common.opensInNewTab")}</span>
    </a>
  );
}
