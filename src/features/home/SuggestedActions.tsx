import { useTranslation } from "react-i18next";
import { StatusDot } from "@/components/StatusDot";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { managers, useAccess } from "@/features/auth/current-user";
import { currentAppUrl } from "@/lib/backend";
import { HomeRow, type HomeRowProps } from "./HomeRow";
import { HomeSection } from "./HomeSection";
import { useFlowsAndTriggers } from "./home-data";
import { relativeTime } from "./relative-time";

const SHOWN_EACH = 2;

function currentAppAction(label: string, path: string) {
  const href = currentAppUrl(path);
  return href ? { label, destination: { href } } : undefined;
}

type Row = HomeRowProps & { id: string };

export function SuggestedActions() {
  const { t, i18n } = useTranslation();
  const { can } = useAccess();
  const data = useFlowsAndTriggers();
  const isManager = can(managers);
  const dot = (tone: "neutral" | "info" | "success") => <StatusDot tone={tone} />;

  const rows: Row[] = [];
  if (!isManager) {
    rows.push({
      id: "chats",
      icon: dot("success"),
      title: t("home.next.chats.title"),
      detail: t("home.next.chats.detail"),
      action: currentAppAction(t("home.next.chats.action"), "/chat"),
    });
  } else if (data.data) {
    const flows = (data.data.flows ?? []).flatMap((flow) => (flow?.id && flow.uuid ? [flow] : []));
    if (flows.length === 0) {
      rows.push({
        id: "first-flow",
        icon: dot("success"),
        title: t("home.next.firstFlow.title"),
        detail: t("home.next.firstFlow.detail"),
        action: currentAppAction(t("home.next.firstFlow.action"), "/flow/add"),
      });
    }
    const drafts = flows.filter(
      (flow) => !flow.lastPublishedAt || (flow.lastChangedAt && flow.lastChangedAt > flow.lastPublishedAt),
    );
    for (const flow of drafts.slice(0, SHOWN_EACH)) {
      const edited = flow.lastChangedAt ?? flow.updatedAt;
      rows.push({
        id: `draft-${flow.id}`,
        icon: dot("neutral"),
        title: flow.name ?? "",
        detail: [
          t(flow.lastPublishedAt ? "home.next.draft.unpublished" : "home.next.draft.never"),
          edited ? t("home.next.draft.edited", { when: relativeTime(edited, i18n.language) }) : null,
        ]
          .filter(Boolean)
          .join(" · "),
        action: currentAppAction(t("home.next.draft.action"), `/flow/configure/${flow.uuid}`),
      });
    }
    const now = new Date().toISOString();
    const scheduled = (data.data.triggers ?? [])
      .flatMap((trigger) =>
        trigger?.id && trigger.isActive && trigger.nextTriggerAt && trigger.nextTriggerAt > now ? [trigger] : [],
      )
      .sort((a, b) => String(a.nextTriggerAt).localeCompare(String(b.nextTriggerAt)));
    const when = new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    for (const trigger of scheduled.slice(0, SHOWN_EACH)) {
      rows.push({
        id: `trigger-${trigger.id}`,
        icon: dot("info"),
        title: trigger.flow?.name ?? trigger.name ?? "",
        detail: [
          when.format(new Date(String(trigger.nextTriggerAt))),
          (trigger.groups ?? []).filter(Boolean).join(", "),
        ]
          .filter(Boolean)
          .join(" · "),
        action: currentAppAction(t("home.next.scheduled.action"), `/trigger/${trigger.id}/edit`),
      });
    }
  }

  let body: React.ReactNode;
  if (isManager && data.isPending) body = <Skeleton className="m-stack h-10" />;
  else if (rows.length === 0)
    body = <p className="px-stack py-3 text-body text-muted-foreground">{t("home.next.none")}</p>;
  else
    body = (
      <ul className="divide-y">
        {rows.map(({ id, ...row }) => (
          <HomeRow key={id} {...row} />
        ))}
      </ul>
    );

  return (
    <HomeSection title={t("home.next.title")}>
      <Card className="gap-0 py-0">{body}</Card>
    </HomeSection>
  );
}
