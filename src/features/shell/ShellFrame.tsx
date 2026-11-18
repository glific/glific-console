import { lazy, type ReactNode, Suspense } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/glific-logo.png";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GlificAiProvider } from "@/features/glific-ai/GlificAiProvider";
import { AppSidebar } from "./AppSidebar";
import { useSideApps } from "./side-apps-context";
import { useRailOpen } from "./use-rail-open";

// The strip's tooltips and the panel load after first paint; neither is needed to show the page.
const SideAppStrip = lazy(async () => ({ default: (await import("./SideAppStrip")).SideAppStrip }));
const SidePanel = lazy(async () => ({ default: (await import("./SidePanel")).SidePanel }));

export function ShellFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [railOpen, setRailOpen] = useRailOpen();
  const sideApps = useSideApps();
  const glificAiOpen = sideApps.open === "glificAi";

  return (
    <GlificAiProvider listening={glificAiOpen}>
      <SidebarProvider open={railOpen} onOpenChange={setRailOpen} className="h-svh overflow-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
        >
          {t("app.skipToContent")}
        </a>
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-inline border-b px-stack md:hidden">
            <SidebarTrigger />
            <img src={logo} alt={t("app.name")} width={38} height={23} />
            <div className="ml-auto">
              <Suspense fallback={null}>
                <SideAppStrip orientation="horizontal" />
              </Suspense>
            </div>
          </header>
          <div id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-page outline-none">
            {children}
          </div>
        </SidebarInset>
        {sideApps.open ? (
          <div className="flex md:py-2">
            <Suspense fallback={null}>
              <SidePanel />
            </Suspense>
          </div>
        ) : null}
        <div className="hidden md:flex">
          <Suspense fallback={<div className="w-14" />}>
            <SideAppStrip />
          </Suspense>
        </div>
      </SidebarProvider>
    </GlificAiProvider>
  );
}
