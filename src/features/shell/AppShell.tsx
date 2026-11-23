import type { ReactNode } from "react";
import { ShellFrame } from "./ShellFrame";
import { SideAppsProvider } from "./SideAppsProvider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SideAppsProvider>
      <ShellFrame>{children}</ShellFrame>
    </SideAppsProvider>
  );
}
