import { AlertTriangleIcon, CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavTargetLink } from "@/components/NavTargetLink";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeRow } from "./HomeRow";
import { HomeSection } from "./HomeSection";
import type { useProblems } from "./use-problems";

export function ThingsToFix({ problems }: { problems: ReturnType<typeof useProblems> }) {
  const { t } = useTranslation();
  let body: React.ReactNode;
  if (problems.isLoading) {
    body = <Skeleton className="m-stack h-10" />;
  } else if (problems.shown.length === 0) {
    body = (
      <p className="flex items-center gap-3 px-stack py-3 text-body text-success">
        <CheckIcon aria-hidden="true" className="size-4" />
        {t("home.fix.none")}
      </p>
    );
  } else {
    body = (
      <ul className="divide-y">
        {problems.shown.map((problem) => (
          <HomeRow
            key={problem.id}
            icon={<AlertTriangleIcon aria-hidden="true" className="size-3.5 text-destructive" />}
            title={problem.title}
            detail={problem.detail}
            action={problem.action}
          />
        ))}
      </ul>
    );
  }
  return (
    <HomeSection
      title={t("home.fix.title")}
      count={problems.total}
      aside={
        problems.allProblems ? (
          <NavTargetLink destination={problems.allProblems} className="text-body-sm text-primary hover:underline">
            {t("home.fix.all")}
          </NavTargetLink>
        ) : null
      }
    >
      <Card className="gap-0 py-0">{body}</Card>
    </HomeSection>
  );
}
