import { type ReactNode, useId } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface ControlProps<Values extends FieldValues, Name extends FieldPath<Values>> {
  field: ControllerRenderProps<Values, Name>;
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FormFieldProps<Values extends FieldValues, Name extends FieldPath<Values>> {
  control: Control<Values, unknown, FieldValues>;
  name: Name;
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
  render: (props: ControlProps<Values, Name>) => ReactNode;
}

/** One form field: label, the control, a hint, and the field's error once the user has left it or submitted. */
export function FormField<Values extends FieldValues, Name extends FieldPath<Values>>({
  control,
  name,
  label,
  hint,
  className,
  render,
}: FormFieldProps<Values, Name>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = Boolean(fieldState.error);
        const describedBy = [hint ? `${id}-hint` : null, invalid ? `${id}-error` : null].filter(Boolean).join(" ");
        return (
          <Field data-invalid={invalid || undefined} className={className}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {render({ field, id, "aria-invalid": invalid, "aria-describedby": describedBy || undefined })}
            {hint ? <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription> : null}
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}

/** A titled group of fields; long forms are split into these. */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-stack", className)}>
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-heading">
          {title}
        </h2>
        {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Save and Cancel at the bottom of a form, kept in view while the form scrolls. */
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
