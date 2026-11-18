import css from "@/styles/tokens.css?raw";
import { ColourChip } from "./ColourChip";

export interface PaletteColour {
  name: string;
  value: string;
  tokens: string[];
}

export type ColourFamily = "Brand" | "Neutrals" | "Status" | "Glific AI" | "Charts" | "WhatsApp chat";

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
                <ColourChip key={colour.name} colour={colour} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
