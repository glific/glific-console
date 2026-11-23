import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useUnreadNotifications } from "@/features/notifications/notifications";
import { cn } from "@/lib/utils";
import { SideAppStripItem } from "./SideAppStripItem";
import { useVisibleSideApps } from "./side-apps";
import { useSideApps } from "./side-apps-context";

export function SideAppStrip({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const sideApps = useSideApps();
  const unread = useUnreadNotifications();
  const vertical = orientation === "vertical";
  // Home has its own Ask box for Glific AI, as in the prototype.
  const items = useVisibleSideApps().items.filter((app) => !(app.id === "glificAi" && pathname === "/"));
  const render = (placement: "top" | "bottom") =>
    items
      .filter((app) => app.placement === placement)
      .map((app) => (
        <SideAppStripItem
          key={app.id}
          app={app}
          isOpen={app.kind === "panel" && sideApps.open === app.id}
          badge={app.id === "notifications" && unread > 0 ? unread : null}
          onToggle={() => app.kind === "panel" && sideApps.toggle(app.id)}
          tooltipSide={vertical ? "left" : "bottom"}
        />
      ));

  return (
    <nav
      aria-label={t("shell.apps.label")}
      className={cn("flex items-center gap-0.5", vertical ? "w-14 flex-col py-3" : "flex-row")}
    >
      {render("top")}
      <span aria-hidden="true" className={vertical ? "mt-auto" : "mx-1 h-6 w-px bg-border"} />
      {render("bottom")}
    </nav>
  );
}
