import { type DefaultValues, type FieldErrors, type FieldValues, type Resolver, useForm } from "react-hook-form";
import { type core, safeParseAsync, type z } from "zod/mini";

function setPath(target: Record<string, unknown>, path: readonly PropertyKey[], value: unknown) {
  let node = target;
  path.forEach((key, index) => {
    const name = String(key);
    if (index === path.length - 1) {
      node[name] ??= value;
      return;
    }
    node[name] ??= {};
    node = node[name] as Record<string, unknown>;
  });
}

// Zod mini: the same schemas as full Zod with a much smaller bundle, since every form page loads it.
type FormSchema = core.$ZodType<FieldValues, FieldValues>;

export function zodResolver<Schema extends FormSchema>(
  schema: Schema,
): Resolver<z.input<Schema>, unknown, z.output<Schema>> {
  return async (values) => {
    const result = await safeParseAsync(schema, values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: Record<string, unknown> = {};
    for (const issue of result.error.issues) {
      setPath(errors, issue.path.length ? issue.path : ["root"], { type: issue.code, message: issue.message });
    }
    return { values: {}, errors: errors as FieldErrors<z.input<Schema>> };
  };
}

export function useZodForm<Schema extends FormSchema>(schema: Schema, defaultValues: DefaultValues<z.input<Schema>>) {
  return useForm<z.input<Schema>, unknown, z.output<Schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
