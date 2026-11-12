import css from "@/styles/tokens.css?raw";

interface PaletteColour {
  /** Primitive name, e.g. "brand-700". */
  name: string;
  value: string;
  /** Semantic tokens that point at this colour. */
  tokens: string[];
}

/** Reads tokens.css and groups semantic tokens by the primitive colour they use, so each colour appears once. */
function paletteColours(): PaletteColour[] {
  const primitives = css.split("/* 2. Semantic tokens */")[0] ?? "";
  const semantic = css.split("/* 2. Semantic tokens */")[1]?.split("/* 3.")[0] ?? "";
  const colours = [...primitives.matchAll(/--palette-([a-z0-9-]+):\s*([^;]+);/g)].map(
    ([, name, value]): PaletteColour => ({ name: name as string, value: (value as string).trim(), tokens: [] }),
  );
  for (const [, token, primitive] of semantic.matchAll(/--([a-z0-9-]+):\s*var\(--palette-([a-z0-9-]+)\)/g)) {
    colours.find((colour) => colour.name === primitive)?.tokens.push(token as string);
  }
  return colours.filter((colour) => colour.tokens.length > 0);
}

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

export function Palette() {
  return (
    <div className="grid grid-cols-2 gap-stack sm:grid-cols-3 lg:grid-cols-4">
      {paletteColours().map((colour) => (
        <div key={colour.name} className="flex flex-col gap-1">
          <div aria-hidden="true" className={`h-14 rounded-lg border ${bgClass[colour.tokens[0] ?? ""] ?? ""}`} />
          <span className="flex items-baseline justify-between gap-inline">
            <span className="font-mono text-body-sm font-medium">{colour.name}</span>
            <span className="font-mono text-caption text-muted-foreground uppercase">{colour.value}</span>
          </span>
          <span className="text-caption text-muted-foreground">{colour.tokens.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}
