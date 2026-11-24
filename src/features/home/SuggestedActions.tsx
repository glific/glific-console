import { useTranslation } from "react-i18next";
import { StatusDot } from "@/components/StatusDot";
import { Card } from "@/components/ui/card";
import { managers, useAccess } from "@/features/auth/current-user";
import { HomeRow, type HomeRowProps } from "./HomeRow";
import { HomeSection } from "./HomeSection";
import { placeholderDrafts, placeholderScheduled } from "./placeholder-data";
import { relativeTime } from "./relative-time";

type Row = HomeRowProps & { id: string };

export function SuggestedActions() {
  const { t, i18n } = useTranslation();
  const { can } = useAccess();
  const isManager = can(managers);
  const dot = (tone: "neutral" | "info" | "success") => <StatusDot tone={tone} />;

  const rows: Row[] = [];
  if (!isManager) {
    rows.push({
      id: "chats",
      icon: dot("success"),
      title: t("home.next.chats.title"),
      detail: t("home.next.chats.detail"),
    });
  } else {
    for (const draft of placeholderDrafts) {
      rows.push({
        id: draft.id,
        icon: dot("neutral"),
        title: draft.name,
        detail: [
          t("home.next.draft.unpublished"),
          t("home.next.draft.edited", {
            when: relativeTime(new Date(Date.now() - draft.editedAgo).toISOString(), i18n.language),
          }),
        ].join(" · "),
      });
    }
    const when = new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    for (const trigger of placeholderScheduled) {
      rows.push({
        id: trigger.id,
        icon: dot("info"),
        title: trigger.name,
        detail: [when.format(new Date(Date.now() + trigger.inMs)), trigger.groups.join(", ")].join(" · "),
      });
    }
  }

  let body: React.ReactNode;
  if (rows.length === 0) body = <p className="px-stack py-3 text-body text-muted-foreground">{t("home.next.none")}</p>;
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
