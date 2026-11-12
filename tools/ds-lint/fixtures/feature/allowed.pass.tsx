import { Button } from "@/components/ui/button";

// None of these should be reported: semantic tokens, standard scale, arbitrary *variants*, composed dialogs.
export function CreateContactDialog() {
  return (
    <div className="flex gap-stack bg-success p-4 text-body text-success-foreground data-[state=open]:bg-muted has-data-[icon=inline-end]:pr-2 [&_svg]:size-4">
      <Button variant="outline">Save</Button>
    </div>
  );
}
