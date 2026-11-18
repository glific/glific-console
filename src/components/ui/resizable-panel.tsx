import type * as React from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

const KEYBOARD_STEP = 16

interface ResizablePanelProps extends React.ComponentProps<"aside"> {
  width: number
  minWidth: number
  maxWidth: number
  onWidthChange: (width: number) => void
}

/** A panel docked to the right of the page, resized by dragging or arrow keys on its left edge. */
function ResizablePanel({
  width,
  minWidth,
  maxWidth,
  onWidthChange,
  className,
  children,
  ...props
}: ResizablePanelProps) {
  const { t } = useTranslation()
  const clamp = (value: number) => Math.min(maxWidth, Math.max(minWidth, value))

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    const startX = event.clientX
    const startWidth = width
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const move = (moveEvent: PointerEvent) =>
      onWidthChange(clamp(startWidth + startX - moveEvent.clientX))
    const stop = () => {
      handle.removeEventListener("pointermove", move)
      handle.removeEventListener("pointerup", stop)
    }
    handle.addEventListener("pointermove", move)
    handle.addEventListener("pointerup", stop)
  }

  function resizeWithKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    const change = { ArrowLeft: KEYBOARD_STEP, ArrowRight: -KEYBOARD_STEP }[
      event.key
    ]
    if (change === undefined) return
    event.preventDefault()
    onWidthChange(clamp(width + change))
  }

  return (
    <div data-slot="resizable-panel" className="flex shrink-0 items-stretch">
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={t("shell.panel.resize")}
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        tabIndex={0}
        onPointerDown={startDrag}
        onKeyDown={resizeWithKeys}
        className="group/handle flex w-2.5 cursor-col-resize touch-none items-center justify-center outline-none"
      >
        <span className="h-9 w-1 rounded-full bg-input transition-colors group-hover/handle:bg-muted-foreground group-focus-visible/handle:bg-ring" />
      </div>
      <aside
        style={{ width }}
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl bg-background shadow-sm",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </div>
  )
}

export { ResizablePanel }
