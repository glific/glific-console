import { XIcon } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/Spinner";
import { IconButton } from "@/components/ui/icon-button";
import { ResizablePanel } from "@/components/ui/ResizablePanel";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { panelApps } from "./side-apps";
import { type SideAppId, useSideApps } from "./side-apps-context";
import { usePersistedNumber } from "./use-persisted-number";

const panels = {
  glificAi: lazy(async () => ({ default: (await import("@/features/glific-ai/GlificAiPanel")).GlificAiPanel })),
  notifications: lazy(async () => ({
    default: (await import("@/features/notifications/NotificationsPanel")).NotificationsPanel,
  })),
  resources: lazy(async () => ({ default: (await import("./ResourcesPanel")).ResourcesPanel })),
} satisfies Record<SideAppId, unknown>;

const WIDTH = { initial: 400, min: 320, max: 640 } as const;

export function SidePanel() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { open, close } = useSideApps();
  const [width, setWidth] = usePersistedNumber("glific.sidePanelWidth", WIDTH.initial);
  const app = panelApps.find((candidate) => candidate.id === open);

  useEffect(() => {
    if (!open || isMobile) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isMobile, close]);

  if (!app) return null;
  const Panel = panels[app.id];
  const Icon = app.icon;
  const title = t(app.label);
  const content = (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner label={t("common.loading")} />
        </div>
      }
    >
      <Panel />
    </Suspense>
  );

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(next) => !next && close()}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">{t(app.tip)}</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ResizablePanel aria-label={title} width={width} minWidth={WIDTH.min} maxWidth={WIDTH.max} onWidthChange={setWidth}>
      <header className="flex min-h-12 items-center gap-inline border-b py-2 pr-2 pl-stack">
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        <h2 className="flex-1 truncate text-body font-semibold">{title}</h2>
        <IconButton icon={XIcon} size="sm" label={t("shell.panel.close", { title })} onClick={close} />
      </header>
      {content}
    </ResizablePanel>
  );
}
