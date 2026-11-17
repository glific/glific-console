import { cn } from "@/lib/utils";

export function MediaPlaceholder({
  label,
  icon,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "mb-1 flex h-40 w-64 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-8",
        className,
      )}
    >
      {icon}
    </div>
  );
}
