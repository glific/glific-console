import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { StripItem } from "./side-apps";

interface SideAppStripItemProps {
  app: StripItem;
  isOpen: boolean;
  badge: number | null;
  onToggle: () => void;
  tooltipSide: "left" | "bottom";
}

export function SideAppStripItem({ app, isOpen, badge, onToggle, tooltipSide }: SideAppStripItemProps) {
  const { t } = useTranslation();
  const Icon = app.icon;
  const label = t(app.label);
  const name = badge ? t("shell.apps.withCount", { label, count: badge }) : label;
  const content = (
    <>
      <Icon aria-hidden="true" />
      {badge ? (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 min-w-4 rounded-full bg-destructive px-1 text-caption text-destructive-foreground"
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </>
  );
  const className = cn(
    "relative rounded-lg [&_svg:not([class*='size-'])]:size-5",
    app.id === "glificAi" &&
      "bg-ai-gradient text-ai-foreground hover:text-ai-foreground hover:brightness-110 aria-pressed:ring-2 aria-pressed:ring-ai/35 aria-pressed:ring-offset-2",
    isOpen && app.id !== "glificAi" && "bg-primary-soft text-primary hover:bg-primary-soft",
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {app.kind === "panel" ? (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={name}
            aria-pressed={isOpen}
            onClick={onToggle}
            className={className}
          >
            {content}
          </Button>
        ) : (
          <Button variant="ghost" size="icon-lg" className={className} asChild>
            <a href={app.href} aria-label={label} {...(app.external ? { target: "_blank", rel: "noreferrer" } : {})}>
              {content}
            </a>
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span>{t(app.tip)}</span>
      </TooltipContent>
    </Tooltip>
  );
}
