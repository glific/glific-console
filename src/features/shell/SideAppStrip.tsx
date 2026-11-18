import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUnreadNotifications } from "@/features/notifications/notifications";
import { cn } from "@/lib/utils";
import { useVisibleSideApps } from "./side-apps";
import { useSideApps } from "./side-apps-context";

export function SideAppStrip({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const { t } = useTranslation();
  const apps = useVisibleSideApps();
  const sideApps = useSideApps();
  const unread = useUnreadNotifications();
  const vertical = orientation === "vertical";
  const tooltipSide = vertical ? "left" : "bottom";

  return (
    <nav
      aria-label={t("shell.apps.label")}
      className={cn("flex items-center gap-0.5", vertical ? "w-14 flex-col py-3" : "flex-row")}
    >
      {apps.panels.map((app) => {
        const Icon = app.icon;
        const label = t(app.label);
        const badge = app.id === "notifications" && unread > 0 ? unread : null;
        const isOpen = sideApps.open === app.id;
        return (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label={badge ? t("shell.apps.withCount", { label, count: badge }) : label}
                aria-pressed={isOpen}
                onClick={() => sideApps.toggle(app.id)}
                className={cn(
                  "relative rounded-lg [&_svg:not([class*='size-'])]:size-5",
                  app.id === "glificAi"
                    ? "bg-ai-gradient text-ai-foreground hover:text-ai-foreground hover:brightness-110 aria-pressed:ring-2 aria-pressed:ring-ai/35 aria-pressed:ring-offset-2"
                    : "",
                  isOpen && app.id !== "glificAi" ? "bg-primary-soft text-primary hover:bg-primary-soft" : "",
                )}
              >
                <Icon aria-hidden="true" />
                {badge ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-0.5 right-0.5 min-w-4 rounded-full bg-destructive px-1 text-caption text-destructive-foreground"
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide} className="flex flex-col">
              <span className="font-medium">{label}</span>
              <span>{t(app.tip)}</span>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {apps.links.length > 0 ? (
        <span aria-hidden="true" className={vertical ? "mt-auto" : "mx-1 h-6 w-px bg-border"} />
      ) : null}
      {apps.links.map((app) => {
        const Icon = app.icon;
        return (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-lg [&_svg:not([class*='size-'])]:size-5"
                asChild
              >
                <a href={app.href} aria-label={t(app.label)}>
                  <Icon aria-hidden="true" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide} className="flex flex-col">
              <span className="font-medium">{t(app.label)}</span>
              <span>{t(app.tip)}</span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
