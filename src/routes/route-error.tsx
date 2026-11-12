import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/monitoring";
import { NotFoundPage } from "./not-found";

export function RouteErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  reportError(error, { source: "route" });

  return (
    <div className="p-page">
      <ErrorState
        onRetry={() => window.location.reload()}
        action={
          <Button variant="ghost" asChild>
            <Link to="/">{t("common.goHome")}</Link>
          </Button>
        }
      />
    </div>
  );
}
