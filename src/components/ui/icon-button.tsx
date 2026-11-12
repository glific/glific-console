import type { LucideIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "size"
> & {
  icon: LucideIcon
  /** Accessible name; also shown as the tooltip. Required, because the button has no visible text. */
  label: string
  size?: "xs" | "sm" | "default" | "lg"
  /** Set false where a tooltip would be noise (e.g. inside a menu that already labels it). */
  tooltip?: boolean
}

const sizeMap = {
  xs: "icon-xs",
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
} as const

/** Icon-only button with a required label, shown as a tooltip (prototype IconButton). */
function IconButton({
  icon: Icon,
  label,
  size = "default",
  variant = "ghost",
  tooltip = true,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      variant={variant}
      size={sizeMap[size]}
      aria-label={label}
      {...props}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
  if (!tooltip) return button
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export { IconButton }
