import { type ReactNode, useId } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

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
