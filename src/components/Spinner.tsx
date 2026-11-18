import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: { size: "md" },
});

interface SpinnerProps extends Omit<ComponentProps<"svg">, "children">, VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ className, size, label, ...props }: SpinnerProps) {
  const { t } = useTranslation();
  return (
    <Loader2Icon
      role="status"
      aria-label={label ?? t("common.loading")}
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}
