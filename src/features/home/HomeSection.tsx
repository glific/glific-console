import { ChevronDownIcon } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface HomeSectionProps {
  title: string;
  /** Shown beside the title, e.g. how many problems there are. */
  count?: number;
  /** Controls on the right of the heading: a period select, a link to the full page. */
  aside?: ReactNode;
  children: ReactNode;
}

/** A foldable section of Home, open by default. */
export function HomeSection({ title, count, aside, children }: HomeSectionProps) {
  const [open, setOpen] = useState(true);
  const headingId = useId();
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <section aria-labelledby={headingId} className="flex flex-col gap-inline">
        <div className="flex min-h-7 items-center justify-between gap-stack">
          <h2 id={headingId} className="text-subheading font-semibold">
            <CollapsibleTrigger className="flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <ChevronDownIcon
                aria-hidden="true"
                className={cn("size-4.5 text-muted-foreground transition-transform", !open && "-rotate-90")}
              />
              {title}
              {count ? <span className="font-normal text-muted-foreground">{count}</span> : null}
            </CollapsibleTrigger>
          </h2>
          {aside ? <div className="flex items-center gap-inline">{aside}</div> : null}
        </div>
        <CollapsibleContent>{children}</CollapsibleContent>
      </section>
    </Collapsible>
  );
}
