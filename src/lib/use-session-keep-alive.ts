import { useEffect } from "react";
import { renewSession } from "./auth";
import { getSession, needsRenewal, RENEW_BEFORE_MS } from "./session";
import { useSession } from "./use-session";

/**
 * Keeps a signed-in session fresh while the app is open: renews shortly before the access token expires, and as
 * soon as someone comes back to the tab or the connection returns. Failures are left to the next request.
 */
export function useSessionKeepAlive() {
  const session = useSession();
  const expiry = session?.token_expiry_time;

  useEffect(() => {
    if (!expiry) return;
    const delay = Math.max(0, new Date(expiry).getTime() - Date.now() - RENEW_BEFORE_MS);
    const timer = setTimeout(() => void renewSession().catch(() => {}), delay);
    return () => clearTimeout(timer);
  }, [expiry]);

  useEffect(() => {
    const renewIfDue = () => {
      const current = getSession();
      if (current && document.visibilityState === "visible" && needsRenewal(current)) {
        void renewSession().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", renewIfDue);
    globalThis.addEventListener("online", renewIfDue);
    return () => {
      document.removeEventListener("visibilitychange", renewIfDue);
      globalThis.removeEventListener("online", renewIfDue);
    };
  }, []);
}
