import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends Omit<ComponentProps<"section">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  /** Heading level for the title; use 1 when the empty state is the whole page. */
  headingLevel?: 1 | 2 | 3;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 2,
  className,
  ...props
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-stack rounded-lg border border-dashed p-section text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-md flex-col gap-1">
        <Heading className="text-heading">{title}</Heading>
        {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-inline">{action}</div> : null}
    </section>
  );
}
