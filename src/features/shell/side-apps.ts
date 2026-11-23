import type { ParseKeys } from "i18next";
import {
  ActivityIcon,
  BellIcon,
  BookOpenIcon,
  LifeBuoyIcon,
  type LucideIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from "lucide-react";
import { everyone, managers, type RoleKind, useAccess } from "@/features/auth/current-user";
import { type OrganizationService, useOrganizationServices } from "@/features/organization/organization";
import { currentAppUrl } from "@/lib/backend";
import type { SideAppId } from "./side-apps-context";

interface SideAppBase {
  label: ParseKeys;
  tip: ParseKeys;
  icon: LucideIcon;
  allow: readonly RoleKind[];
  /** Shown when any of these is on. */
  services?: readonly OrganizationService[];
}

export interface SidePanelApp extends SideAppBase {
  id: SideAppId;
}

type StripEntry = SideAppBase & { placement: "top" | "bottom" } & (
    | { kind: "panel"; id: SideAppId }
    | { kind: "currentApp"; id: string; currentAppPath: string }
    | { kind: "external"; id: string; href: string }
  );

export type StripItem = SideAppBase & { placement: "top" | "bottom" } & (
    | { kind: "panel"; id: SideAppId }
    | { kind: "link"; id: string; href: string; external: boolean }
  );

// The prototype's right strip, top to bottom. Schedule joins when it is built.
const strip: readonly StripEntry[] = [
  {
    kind: "panel",
    id: "glificAi",
    placement: "top",
    label: "glificAi.name",
    tip: "glificAi.tip",
    icon: SparklesIcon,
    allow: everyone,
    services: ["askGlificEnabled", "glificAiEnabled"],
  },
  {
    kind: "currentApp",
    id: "logs",
    placement: "top",
    label: "nav.pages.webhookLogs",
    tip: "shell.apps.logsTip",
    icon: ActivityIcon,
    allow: managers,
    currentAppPath: "/webhook-logs",
  },
  {
    kind: "panel",
    id: "notifications",
    placement: "top",
    label: "notifications.title",
    tip: "notifications.tip",
    icon: BellIcon,
    allow: managers,
  },
  {
    kind: "currentApp",
    id: "tickets",
    placement: "top",
    label: "shell.apps.tickets",
    tip: "shell.apps.ticketsTip",
    icon: LifeBuoyIcon,
    allow: everyone,
    services: ["ticketingEnabled"],
    currentAppPath: "/ticket",
  },
  {
    kind: "panel",
    id: "resources",
    placement: "bottom",
    label: "shell.resources.title",
    tip: "shell.resources.tip",
    icon: BookOpenIcon,
    allow: everyone,
  },
  {
    kind: "external",
    id: "raiseTicket",
    placement: "bottom",
    label: "shell.apps.raiseTicket",
    tip: "shell.apps.raiseTicketTip",
    icon: MessageCircleQuestionIcon,
    allow: everyone,
    href: "https://discord.gg/kyqsZAJEPK",
  },
];

export const panelApps: readonly SidePanelApp[] = strip.flatMap((entry) => (entry.kind === "panel" ? [entry] : []));

export function useVisibleSideApps() {
  const access = useAccess();
  const services = useOrganizationServices();
  const visible = (app: SideAppBase) =>
    access.can(app.allow) && (!app.services || app.services.some((service) => services.enabled(service)));
  const items = strip.filter(visible).map((entry): StripItem => {
    if (entry.kind === "panel") return entry;
    const { id, placement, label, tip, icon, allow, services: needs } = entry;
    const external = entry.kind === "external";
    const href = external ? entry.href : currentAppUrl(entry.currentAppPath);
    return { id, placement, label, tip, icon, allow, services: needs, kind: "link", href, external };
  });
  return {
    items,
    panels: panelApps.filter(visible),
  };
}
