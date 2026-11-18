import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/Spinner";
import { PermissionDeniedPage } from "@/routes/PermissionDeniedPage";
import { type RoleKind, useAccess } from "./current-user";

export function RequireAccess({ allow, children }: { allow: readonly RoleKind[]; children: ReactNode }) {
  const { t } = useTranslation();
  const { can, isLoading } = useAccess();
  if (isLoading) {
    return (
      <div className="flex justify-center p-section">
        <Spinner label={t("common.loading")} />
      </div>
    );
  }
  return can(allow) ? children : <PermissionDeniedPage />;
}
