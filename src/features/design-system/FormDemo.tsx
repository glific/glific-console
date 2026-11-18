import { z } from "zod";
import { FormActions, FormField, FormSection, useZodForm } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const demoTagSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  keywords: z.string().trim().max(200, "Keep it under 200 characters"),
});

export function FormDemo() {
  const form = useZodForm(demoTagSchema, { name: "", keywords: "" });
  return (
    <form
      onSubmit={form.handleSubmit(() => form.reset())}
      noValidate
      className="flex w-full max-w-xl flex-col gap-section"
    >
      <FormSection title="Tag details" description="Errors show once a field is left, then update as you type.">
        <FormField
          control={form.control}
          name="name"
          label="Name"
          render={({ field, ...aria }) => <Input {...field} {...aria} />}
        />
        <FormField
          control={form.control}
          name="keywords"
          label="Keywords"
          hint="Comma separated. Messages with these words get the tag."
          render={({ field, ...aria }) => <Textarea {...field} {...aria} />}
        />
      </FormSection>
      <FormActions onCancel={() => form.reset()} />
    </form>
  );
}
