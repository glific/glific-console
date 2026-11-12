import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <EmptyState
      headingLevel={1}
      title={t("errors.notFound.title")}
      description={t("errors.notFound.description")}
      action={
        <Button asChild>
          <Link to="/">{t("common.goHome")}</Link>
        </Button>
      }
    />
  );
}
