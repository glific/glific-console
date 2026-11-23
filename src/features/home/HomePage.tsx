import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth/current-user";
import { useOrganization } from "@/features/organization/organization";
import { useVisibleSideApps } from "@/features/shell/side-apps";
import { cn } from "@/lib/utils";
import { dayMood } from "./day-mood";
import { HomeAsk } from "./HomeAsk";
import { HomeGreeting } from "./HomeGreeting";
import { HowItsGoing } from "./HowItsGoing";
import { useFlowsAndTriggers } from "./home-data";
import { SuggestedActions } from "./SuggestedActions";
import { ThingsToFix } from "./ThingsToFix";
import { TrialStrip } from "./TrialStrip";
import { useProblems } from "./use-problems";

const DAY = 24 * 60 * 60 * 1000;

const wash = {
  morning: "from-mood-morning-wash",
  afternoon: "from-mood-afternoon-wash",
  evening: "from-mood-evening-wash",
  night: "from-mood-night-wash",
} as const;

export function HomePage() {
  const { t } = useTranslation();
  const mood = dayMood();
  const user = useCurrentUser().data;
  const organization = useOrganization().data;
  const flows = useFlowsAndTriggers().data?.flows;
  const problems = useProblems();
  const hasGlificAi = useVisibleSideApps().panels.some((app) => app.id === "glificAi");
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";

  const trial = organization?.isTrialOrg ?? false;
  // No end date means we don't know, not that the trial has ended.
  const daysLeft = organization?.trialExpirationDate
    ? Math.max(0, Math.ceil((new Date(organization.trialExpirationDate).getTime() - Date.now()) / DAY))
    : null;
  const noFlows = flows != null && flows.length === 0;

  let summary: string | null = null;
  if (noFlows) summary = t("home.summary.firstFlow");
  else if (trial && daysLeft !== null) {
    summary = daysLeft > 0 ? t("home.summary.trial", { count: daysLeft }) : t("home.trial.ended");
  } else if (!problems.isLoading) {
    summary = problems.total > 0 ? t("home.summary.problems", { count: problems.total }) : t("home.fix.none");
  }

  let stage: "new" | "trial" | "returning" = "returning";
  if (noFlows) stage = "new";
  else if (trial) stage = "trial";
  const suggestions = (["one", "two", "three", "four"] as const).map((n) => t(`home.ask.pills.${stage}.${n}`));

  return (
    <div className="relative -m-page flex flex-col p-page">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b to-transparent",
          wash[mood.mood],
        )}
      />
      <div className="relative mx-auto flex w-full max-w-170 flex-col items-center gap-section pt-16 pb-8 md:pt-32">
        {trial ? <TrialStrip daysLeft={daysLeft} /> : null}
        <HomeGreeting mood={mood} firstName={firstName} summary={summary} />
        {hasGlificAi ? <HomeAsk suggestions={suggestions} /> : null}
      </div>
      <div className="relative mx-auto flex w-full max-w-190 flex-col gap-5 pb-section">
        <HowItsGoing />
        <ThingsToFix problems={problems} />
        <SuggestedActions />
      </div>
    </div>
  );
}
