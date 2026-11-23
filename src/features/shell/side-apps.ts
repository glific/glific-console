import type { ParseKeys } from "i18next";
import { ActivityIcon, BellIcon, BookOpenIcon, LifeBuoyIcon, type LucideIcon, SparklesIcon } from "lucide-react";
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

export interface SideLinkApp extends SideAppBase {
  id: string;
  currentAppPath: string;
}

export const panelApps: readonly SidePanelApp[] = [
  {
    id: "glificAi",
    label: "glificAi.name",
    tip: "glificAi.tip",
    icon: SparklesIcon,
    allow: everyone,
    services: ["askGlificEnabled", "glificAiEnabled"],
  },
  { id: "notifications", label: "notifications.title", tip: "notifications.tip", icon: BellIcon, allow: managers },
  { id: "resources", label: "shell.resources.title", tip: "shell.resources.tip", icon: BookOpenIcon, allow: everyone },
];

export const linkApps: readonly SideLinkApp[] = [
  {
    id: "logs",
    label: "nav.pages.webhookLogs",
    tip: "shell.apps.logsTip",
    icon: ActivityIcon,
    allow: managers,
    currentAppPath: "/webhook-logs",
  },
  {
    id: "tickets",
    label: "shell.apps.tickets",
    tip: "shell.apps.ticketsTip",
    icon: LifeBuoyIcon,
    allow: everyone,
    services: ["ticketingEnabled"],
    currentAppPath: "/ticket",
  },
];

export function useVisibleSideApps() {
  const access = useAccess();
  const services = useOrganizationServices();
  const visible = (app: SideAppBase) =>
    access.can(app.allow) && (!app.services || app.services.some((service) => services.enabled(service)));
  return {
    panels: panelApps.filter(visible),
    links: linkApps.filter(visible).map((app) => ({ ...app, href: currentAppUrl(app.currentAppPath) })),
  };
}
