import type { ReactNode } from "react";
import { ShellFrame } from "./ShellFrame";
import { SideAppsProvider } from "./SideAppsProvider";

/** The signed-in frame: rail on the left, the page, then the right panel and its app strip. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SideAppsProvider>
      <ShellFrame>{children}</ShellFrame>
    </SideAppsProvider>
  );
}
