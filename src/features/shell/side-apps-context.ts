import { createContext, useContext } from "react";

export type SideAppId = "glificAi" | "notifications" | "resources";

export interface SideAppsState {
  open: SideAppId | null;
  show: (app: SideAppId) => void;
  toggle: (app: SideAppId) => void;
  close: () => void;
}

export const SideAppsContext = createContext<SideAppsState | null>(null);

export function useSideApps(): SideAppsState {
  const state = useContext(SideAppsContext);
  if (!state) throw new Error("useSideApps must be used inside the app shell.");
  return state;
}
