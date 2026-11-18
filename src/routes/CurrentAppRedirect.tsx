import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Spinner } from "@/components/Spinner";
import { currentAppUrl } from "@/lib/backend";
import { browser } from "@/lib/browser";
import { NotFoundPage } from "./NotFoundPage";

/** Forwards an old link to the same page in the current app, which still serves it. */
export function CurrentAppRedirect() {
  const { t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const target = currentAppUrl(`${pathname}${search}${hash}`);
  // Served from the current app's own address, there is no other app to go to: forwarding would loop.
  const sameApp = new URL(target).origin === globalThis.location.origin;

  useEffect(() => {
    if (!sameApp) browser.open(target);
  }, [sameApp, target]);

  if (sameApp) return <NotFoundPage />;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-stack">
      <Spinner aria-hidden="true" />
      <p className="text-body text-muted-foreground" role="status">
        {t("errors.openingCurrentApp")}
      </p>
    </div>
  );
}
