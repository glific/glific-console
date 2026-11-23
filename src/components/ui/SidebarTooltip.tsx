import type * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function SidebarTooltip({
  content,
  children,
}: {
  content: React.ComponentProps<typeof TooltipContent>
  children: React.ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" align="center" {...content} />
    </Tooltip>
  )
}

export { SidebarTooltip }
