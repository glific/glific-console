import { CircleAlertIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** When provided, renders a "Try again" button that calls it. */
  onRetry?: () => void;
  /** Extra actions rendered after the retry button. */
  action?: ReactNode;
}

export function ErrorState({ title, description, onRetry, action, className, ...props }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <section
      role="alert"
      data-slot="error-state"
      className={cn("flex flex-col items-center justify-center gap-stack p-section text-center", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive [&_svg]:size-6"
      >
        <CircleAlertIcon />
      </div>
      <div className="flex max-w-md flex-col gap-1">
        <h2 className="text-heading">{title ?? t("errors.generic.title")}</h2>
        <p className="text-body text-muted-foreground">{description ?? t("errors.generic.description")}</p>
      </div>
      {onRetry || action ? (
        <div className="flex items-center gap-inline">
          {onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              {t("common.retry")}
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </section>
  );
}
