import type { ParseKeys } from "i18next";
import {
  BotIcon,
  ChartColumnIcon,
  HouseIcon,
  LibraryBigIcon,
  type LucideIcon,
  MessagesSquareIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import type { NavLinkTarget } from "@/components/NavTargetLink";
import {
  admins,
  everyone,
  glificAdmins,
  managers,
  type RoleKind,
  staffManagers,
  useAccess,
} from "@/features/auth/current-user";
import { type OrganizationService, useOrganizationServices } from "@/features/organization/organization";
import { currentAppUrl } from "@/lib/backend";

export type NavPage = {
  id: string;
  label: ParseKeys;
  allow: readonly RoleKind[];
  service?: OrganizationService;
} & ({ to: string; end?: boolean } | { currentAppPath: string });

export interface NavSection {
  id: string;
  label: ParseKeys;
  icon: LucideIcon;
  pages: readonly NavPage[];
}

export interface ResolvedPage {
  id: string;
  label: ParseKeys;
  target: NavLinkTarget;
}

export interface ResolvedSection {
  id: string;
  label: ParseKeys;
  icon: LucideIcon;
  target: NavLinkTarget;
  pages: ResolvedPage[];
}

// The rail, in groups separated by a divider. Order and grouping follow the 2.0 prototype; who sees each page
// follows the current app's menu.
export const railGroups: readonly (readonly NavSection[])[] = [
  [
    {
      id: "home",
      label: "nav.home",
      icon: HouseIcon,
      pages: [{ id: "home", label: "nav.home", allow: everyone, to: "/", end: true }],
    },
    {
      id: "chats",
      label: "nav.chats",
      icon: MessagesSquareIcon,
      pages: [
        { id: "chats", label: "nav.pages.chats", allow: everyone, currentAppPath: "/chat" },
        {
          id: "groupChats",
          label: "nav.pages.groupChats",
          allow: everyone,
          service: "whatsappGroupEnabled",
          currentAppPath: "/group/chat",
        },
        { id: "searches", label: "nav.pages.searches", allow: managers, currentAppPath: "/search" },
        { id: "speedSends", label: "nav.pages.speedSends", allow: managers, currentAppPath: "/speed-send" },
      ],
    },
    {
      id: "flows",
      label: "nav.flows",
      icon: WorkflowIcon,
      pages: [
        { id: "flows", label: "nav.pages.flows", allow: managers, currentAppPath: "/flow" },
        { id: "triggers", label: "nav.pages.triggers", allow: managers, currentAppPath: "/trigger" },
        { id: "webhookLogs", label: "nav.pages.webhookLogs", allow: managers, currentAppPath: "/webhook-logs" },
      ],
    },
  ],
  [
    {
      id: "library",
      label: "nav.library",
      icon: LibraryBigIcon,
      pages: [
        {
          id: "interactiveMessages",
          label: "nav.pages.interactiveMessages",
          allow: managers,
          currentAppPath: "/interactive-message",
        },
        { id: "templates", label: "nav.pages.templates", allow: managers, currentAppPath: "/template" },
        {
          id: "whatsappForms",
          label: "nav.pages.whatsappForms",
          allow: managers,
          service: "whatsappFormsEnabled",
          currentAppPath: "/whatsapp-forms",
        },
        {
          id: "polls",
          label: "nav.pages.polls",
          allow: managers,
          service: "whatsappGroupEnabled",
          currentAppPath: "/group/polls",
        },
        { id: "sheets", label: "nav.pages.sheets", allow: managers, currentAppPath: "/sheet-integration" },
        {
          id: "certificates",
          label: "nav.pages.certificates",
          allow: managers,
          service: "certificateEnabled",
          currentAppPath: "/certificates",
        },
      ],
    },
    {
      id: "ai",
      label: "nav.ai",
      icon: BotIcon,
      pages: [
        { id: "assistants", label: "nav.pages.assistants", allow: managers, currentAppPath: "/assistants" },
        { id: "aiEvaluations", label: "nav.pages.aiEvaluations", allow: managers, currentAppPath: "/ai-evaluations" },
      ],
    },
    {
      id: "analytics",
      label: "nav.analytics",
      icon: ChartColumnIcon,
      pages: [{ id: "analytics", label: "nav.analytics", allow: everyone, currentAppPath: "/analytics" }],
    },
  ],
  [
    {
      id: "contacts",
      label: "nav.contacts",
      icon: UsersIcon,
      pages: [
        { id: "contacts", label: "nav.pages.allContacts", allow: everyone, to: "/contacts" },
        { id: "collections", label: "nav.pages.collections", allow: everyone, currentAppPath: "/collection" },
        {
          id: "groupCollections",
          label: "nav.pages.groupCollections",
          allow: everyone,
          service: "whatsappGroupEnabled",
          currentAppPath: "/group/collection",
        },
        { id: "contactFields", label: "nav.pages.contactFields", allow: managers, currentAppPath: "/contact-fields" },
        { id: "blocked", label: "nav.pages.blocked", allow: everyone, currentAppPath: "/blocked-contacts" },
        { id: "import", label: "nav.pages.import", allow: admins, currentAppPath: "/contact-management" },
      ],
    },
  ],
];

// Reached from the account menu rather than the rail, as in the prototype.
export const settingsSection: NavSection = {
  id: "settings",
  label: "nav.settings",
  icon: SettingsIcon,
  pages: [
    { id: "settings", label: "nav.pages.organizationSettings", allow: admins, currentAppPath: "/settings" },
    { id: "staff", label: "nav.pages.staff", allow: staffManagers, currentAppPath: "/staff-management" },
    {
      id: "roles",
      label: "nav.pages.roles",
      allow: staffManagers,
      service: "rolesAndPermission",
      currentAppPath: "/role",
    },
    { id: "tags", label: "nav.pages.tags", allow: managers, currentAppPath: "/tag" },
    {
      id: "phones",
      label: "nav.pages.phones",
      allow: managers,
      service: "whatsappGroupEnabled",
      currentAppPath: "/group/phones",
    },
  ],
};

export const glificAdminSection: NavSection = {
  id: "glificAdmin",
  label: "nav.glificAdmin",
  icon: ShieldIcon,
  pages: [
    { id: "organizations", label: "nav.pages.organizations", allow: glificAdmins, currentAppPath: "/organizations" },
    { id: "consulting", label: "nav.pages.consulting", allow: glificAdmins, currentAppPath: "/consulting-hours" },
    { id: "designSystem", label: "nav.designSystem", allow: glificAdmins, to: "/design-system" },
  ],
};

export const myAccountUrl = () => currentAppUrl("/myaccount");

function resolvePage(page: NavPage): ResolvedPage {
  const target: NavLinkTarget =
    "to" in page ? { to: page.to, end: page.end } : { href: currentAppUrl(page.currentAppPath) };
  return { id: page.id, label: page.label, target };
}

export function useNavigation() {
  const access = useAccess();
  const services = useOrganizationServices();
  const visible = (page: NavPage) => access.can(page.allow) && (!page.service || services.enabled(page.service));
  const resolve = (section: NavSection): ResolvedSection | null => {
    const pages = section.pages.filter(visible).map(resolvePage);
    const first = pages[0];
    return first ? { id: section.id, label: section.label, icon: section.icon, target: first.target, pages } : null;
  };
  const sections = (list: readonly NavSection[]) => list.flatMap((section) => resolve(section) ?? []);
  return {
    rail: railGroups.map(sections).filter((group) => group.length > 0),
    settings: resolve(settingsSection),
    glificAdmin: resolve(glificAdminSection),
    section: (id: string) => [...railGroups.flat(), settingsSection, glificAdminSection].find((s) => s.id === id),
    resolve,
    isLoading: access.isLoading || services.isLoading,
  };
}
