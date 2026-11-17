import { cn } from "@/lib/utils";
import type { PaletteColour } from "./palette";

// Tailwind only generates classes it can see as literal strings, so each token's class is spelled out.
const bgClass: Record<string, string> = {
  background: "bg-background",
  foreground: "bg-foreground",
  shell: "bg-shell",
  card: "bg-card",
  "card-foreground": "bg-card-foreground",
  popover: "bg-popover",
  "popover-foreground": "bg-popover-foreground",
  primary: "bg-primary",
  "primary-hover": "bg-primary-hover",
  "primary-foreground": "bg-primary-foreground",
  "primary-soft": "bg-primary-soft",
  secondary: "bg-secondary",
  "secondary-foreground": "bg-secondary-foreground",
  muted: "bg-muted",
  "muted-foreground": "bg-muted-foreground",
  accent: "bg-accent",
  "accent-foreground": "bg-accent-foreground",
  destructive: "bg-destructive",
  "destructive-foreground": "bg-destructive-foreground",
  "destructive-soft": "bg-destructive-soft",
  success: "bg-success",
  "success-foreground": "bg-success-foreground",
  "success-soft": "bg-success-soft",
  warning: "bg-warning",
  "warning-foreground": "bg-warning-foreground",
  "warning-soft": "bg-warning-soft",
  info: "bg-info",
  "info-foreground": "bg-info-foreground",
  "info-soft": "bg-info-soft",
  ai: "bg-ai",
  "ai-foreground": "bg-ai-foreground",
  "ai-soft": "bg-ai-soft",
  border: "bg-border",
  input: "bg-input",
  ring: "bg-ring",
  "chat-surface": "bg-chat-surface",
  "chat-inbound": "bg-chat-inbound",
  "chat-outbound": "bg-chat-outbound",
  "chat-meta": "bg-chat-meta",
  "chat-read": "bg-chat-read",
  whatsapp: "bg-whatsapp",
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
  sidebar: "bg-sidebar",
  "sidebar-foreground": "bg-sidebar-foreground",
  "sidebar-primary": "bg-sidebar-primary",
  "sidebar-primary-foreground": "bg-sidebar-primary-foreground",
  "sidebar-accent": "bg-sidebar-accent",
  "sidebar-accent-foreground": "bg-sidebar-accent-foreground",
  "sidebar-border": "bg-sidebar-border",
  "sidebar-ring": "bg-sidebar-ring",
};

export function ColourChip({ colour, large }: { colour: PaletteColour; large?: boolean }) {
  const swatch = bgClass[colour.tokens[0] ?? ""] ?? "";
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", large && "flex-col items-stretch")}
      title={colour.tokens.join(", ")}
    >
      <div
        aria-hidden="true"
        className={cn("shrink-0 rounded-md border", large ? "h-20 w-full rounded-xl" : "size-8", swatch)}
      />
      <div className="flex min-w-0 flex-col">
        <span className="flex items-baseline gap-inline">
          <span className="truncate text-body-sm font-medium">{colour.tokens[0]}</span>
          <span className="font-mono text-caption text-muted-foreground uppercase">{colour.value}</span>
        </span>
        {colour.tokens.length > 1 ? (
          <span className="truncate text-caption text-muted-foreground">also {colour.tokens.slice(1).join(", ")}</span>
        ) : null}
      </div>
    </div>
  );
}
