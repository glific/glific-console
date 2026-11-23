import { cva } from "class-variance-authority";
import { type NavLinkTarget, NavTargetLink } from "@/components/NavTargetLink";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
  destination: NavLinkTarget;
}

const listVariants = cva("flex", {
  variants: {
    variant: {
      tabs: "gap-1 overflow-x-auto border-b",
      column: "w-60 flex-col gap-0.5",
    },
  },
});

const linkVariants = cva(
  "flex items-center whitespace-nowrap text-body text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:font-medium aria-[current=page]:text-foreground",
  {
    variants: {
      variant: {
        tabs: "-mb-px rounded-t-md border-b-2 border-transparent px-3 py-2 aria-[current=page]:border-primary",
        column: "rounded-lg px-3 py-2 hover:bg-accent aria-[current=page]:bg-accent",
      },
    },
  },
);

interface SectionNavProps {
  label: string;
  items: readonly SectionNavItem[];
  variant?: "tabs" | "column";
  className?: string;
}

export function SectionNav({ label, items, variant = "tabs", className }: SectionNavProps) {
  return (
    <nav aria-label={label} data-slot="section-nav" className={className}>
      <ul className={listVariants({ variant })}>
        {items.map((item) => (
          <li key={item.id}>
            <NavTargetLink destination={item.destination} className={cn(linkVariants({ variant }))}>
              {item.label}
            </NavTargetLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
