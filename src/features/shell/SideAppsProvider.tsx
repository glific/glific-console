import { type ReactNode, useMemo, useState } from "react";
import { type SideAppId, SideAppsContext } from "./side-apps-context";

export function SideAppsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<SideAppId | null>(null);
  const state = useMemo(
    () => ({
      open,
      show: (app: SideAppId) => setOpen(app),
      toggle: (app: SideAppId) => setOpen((current) => (current === app ? null : app)),
      close: () => setOpen(null),
    }),
    [open],
  );
  return <SideAppsContext.Provider value={state}>{children}</SideAppsContext.Provider>;
}
