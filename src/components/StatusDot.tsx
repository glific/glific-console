import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const statusDotVariants = cva("inline-block size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      neutral: "bg-muted-foreground",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-destructive",
      info: "bg-info",
      ai: "bg-ai",
      live: "bg-whatsapp",
    },
    pulse: { true: "animate-pulse", false: "" },
  },
  defaultVariants: { tone: "neutral", pulse: false },
});

interface StatusDotProps extends Omit<ComponentProps<"span">, "children">, VariantProps<typeof statusDotVariants> {
  /** Text alternative. Omit only when a visible label sits next to the dot. */
  label?: string;
}

export function StatusDot({ tone, pulse, label, className, ...props }: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      className={cn(statusDotVariants({ tone, pulse }), className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...props}
    />
  );
}
