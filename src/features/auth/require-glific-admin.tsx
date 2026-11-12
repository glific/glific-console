import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/spinner";
import { NotFoundPage } from "@/routes/not-found";
import { useIsGlificAdmin } from "./current-user";

/** Internal pages: Glific admins only. Everyone else gets the normal 404, so the page's existence isn't revealed. */
export function RequireGlificAdmin({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { isGlificAdmin, isLoading } = useIsGlificAdmin();
  if (isLoading) {
    return (
      <div className="flex justify-center p-section">
        <Spinner label={t("common.loading")} />
      </div>
    );
  }
  return isGlificAdmin ? children : <NotFoundPage />;
}
