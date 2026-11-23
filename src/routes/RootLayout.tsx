import { useEffect } from "react";
import { Outlet } from "react-router";
import { roleLabels, useCurrentUser } from "@/features/auth/current-user";
import { useUserLanguage } from "@/features/language/use-user-language";
import { AppShell } from "@/features/shell";
import { identifyUser } from "@/lib/monitoring";
import { getSession } from "@/lib/session";
import { useSessionKeepAlive } from "@/lib/use-session-keep-alive";

export function RootLayout() {
  useIdentifyUser();
  useUserLanguage();
  useSessionKeepAlive();
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function useIdentifyUser() {
  const user = useCurrentUser().data;
  useEffect(() => {
    if (!user?.id || !user.organization?.id) return;
    identifyUser(
      { id: user.id, roles: roleLabels(user) },
      { id: user.organization.id, isTrial: getSession()?.is_trial },
    );
  }, [user]);
}
