import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FormActions({
  onCancel,
  saving = false,
  saveLabel,
  className,
}: {
  onCancel: () => void;
  saving?: boolean;
  saveLabel?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn("sticky bottom-0 flex justify-end gap-inline border-t bg-background py-stack", className)}>
      <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
        {t("form.cancel")}
      </Button>
      <Button type="submit" disabled={saving}>
        {saving ? <Spinner size="sm" label={t("form.saving")} /> : null}
        {saveLabel ?? t("form.save")}
      </Button>
    </div>
  );
}
