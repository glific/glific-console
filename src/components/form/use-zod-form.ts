import { type DefaultValues, type FieldErrors, type FieldValues, type Resolver, useForm } from "react-hook-form";
import type { z } from "zod";

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

export function zodResolver<Schema extends z.ZodType<FieldValues, FieldValues>>(
  schema: Schema,
): Resolver<z.input<Schema>, unknown, z.output<Schema>> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: Record<string, unknown> = {};
    for (const issue of result.error.issues) {
      setPath(errors, issue.path.length ? issue.path : ["root"], { type: issue.code, message: issue.message });
    }
    return { values: {}, errors: errors as FieldErrors<z.input<Schema>> };
  };
}

export function useZodForm<Schema extends z.ZodType<FieldValues, FieldValues>>(
  schema: Schema,
  defaultValues: DefaultValues<z.input<Schema>>,
) {
  return useForm<z.input<Schema>, unknown, z.output<Schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
