import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export function PermissionDeniedPage() {
  const { t } = useTranslation();
  return (
    <EmptyState
      headingLevel={1}
      title={t("errors.permissionDenied.title")}
      description={t("errors.permissionDenied.description")}
      action={
        <Button asChild>
          <Link to="/">{t("common.goHome")}</Link>
        </Button>
      }
    />
  );
}
