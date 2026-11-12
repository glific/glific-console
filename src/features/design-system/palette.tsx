import { cn } from "@/lib/utils";
import css from "@/styles/tokens.css?raw";

export interface PaletteColour {
  /** Primitive name, e.g. "brand-700". */
  name: string;
  value: string;
  /** Semantic tokens that point at this colour. */
  tokens: string[];
}

export type ColourFamily = "Brand" | "Neutrals" | "Status" | "Glific AI" | "Charts" | "WhatsApp chat";

/** Reads tokens.css and groups semantic tokens by the primitive colour they use, so each colour appears once. */
export function paletteColours(): PaletteColour[] {
  const [primitives = "", rest = ""] = css.split("/* 2. Semantic tokens */");
  const semantic = rest.split("/* 3.")[0] ?? "";
  const colours = [...primitives.matchAll(/--palette-([a-z0-9-]+):\s*([^;]+);/g)].map(
    ([, name, value]): PaletteColour => ({ name: name as string, value: (value as string).trim(), tokens: [] }),
  );
  for (const [, token, primitive] of semantic.matchAll(/--([a-z0-9-]+):\s*var\(--palette-([a-z0-9-]+)\)/g)) {
    colours.find((colour) => colour.name === primitive)?.tokens.push(token as string);
  }
  return colours.filter((colour) => colour.tokens.length > 0);
}

export function familyOf(colour: PaletteColour): ColourFamily {
  if (colour.tokens.every((token) => token.startsWith("chart-"))) return "Charts";
  if (colour.name.startsWith("brand-")) return "Brand";
  if (colour.name.startsWith("wa-")) return "WhatsApp chat";
  if (colour.name.startsWith("violet-")) return "Glific AI";
  if (colour.name === "white" || colour.name.startsWith("zinc-")) return "Neutrals";
  return "Status";
}

const families: { name: ColourFamily; note: string }[] = [
  {
    name: "Brand",
    note: "One deep green for the main action and live state. Use it sparingly: one primary button per view.",
  },
  { name: "Neutrals", note: "Text, surfaces and lines. Most of the UI is these." },
  { name: "Status", note: "Each status has a strong colour for text and a soft fill for tags and banners." },
  { name: "Glific AI", note: "Violet, never green, so an AI suggestion is never mistaken for something live." },
  { name: "Charts", note: "Data series only." },
  { name: "WhatsApp chat", note: "Conversation surfaces, so chats look like WhatsApp." },
];

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

function Chip({ colour, large }: { colour: PaletteColour; large?: boolean }) {
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

/** Brand colours, large: the brand book's greens. */
export function BrandColours() {
  const brand = paletteColours().filter((colour) => familyOf(colour) === "Brand");
  return (
    <div className="grid grid-cols-2 gap-stack sm:grid-cols-4">
      {brand.map((colour) => (
        <Chip key={colour.name} colour={colour} large />
      ))}
    </div>
  );
}

/** Every colour once, grouped by family, compact. */
export function Palette() {
  const colours = paletteColours();
  return (
    <div className="flex flex-col gap-section">
      {families.map((family) => {
        const items = colours.filter((colour) => familyOf(colour) === family.name);
        if (items.length === 0) return null;
        return (
          <div key={family.name} className="grid gap-stack md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-subheading">{family.name}</h3>
              <p className="text-body-sm text-muted-foreground">{family.note}</p>
            </div>
            <div className="grid gap-x-section gap-y-3 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
              {items.map((colour) => (
                <Chip key={colour.name} colour={colour} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
