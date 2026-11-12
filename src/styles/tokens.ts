// Primitive --palette-* values are deliberately not listed: nothing outside tokens.css may use them.

export type TokenGroup = "color" | "chart" | "sidebar" | "radius" | "font" | "typography" | "spacing";

export interface TokenDefinition {
  /** CSS custom property, without the leading `--`. */
  readonly name: string;
  readonly group: TokenGroup;
  readonly description: string;
  readonly utility?: string;
}

const color = (name: string, description: string): TokenDefinition => ({
  name,
  group: "color",
  description,
  utility: name,
});

export const colorTokens = [
  color("background", "Default surface: cards, panels, the content area."),
  color("foreground", "Default text."),
  color("shell", "The grey ground around content (behind the page)."),
  color("card", "Card surface."),
  color("card-foreground", "Text on card."),
  color("popover", "Popover, menu and tooltip surface."),
  color("popover-foreground", "Text on popover."),
  color("primary", "Brand deep green: the one main action on a screen, live state."),
  color("primary-hover", "Primary on hover and press: darker, so text keeps its contrast."),
  color("primary-foreground", "Text and icons on primary."),
  color("primary-soft", "Soft green fill behind picked pills, tabs and selected rows."),
  color("secondary", "Grey control fill: secondary buttons, segment tracks."),
  color("secondary-foreground", "Text on secondary (brand green)."),
  color("muted", "Subtle surface: table stripes, disabled fills."),
  color("muted-foreground", "De-emphasised text: hints, metadata."),
  color("accent", "Hover and selected surface for menu items and rows."),
  color("accent-foreground", "Text on accent."),
  color("destructive", "Errors and irreversible actions; also readable error text."),
  color("destructive-foreground", "Text on a solid destructive fill."),
  color("destructive-soft", "Soft red fill behind error tags and banners."),
  color("success", "Positive status: sent, approved, healthy."),
  color("success-foreground", "Text on a solid success fill."),
  color("success-soft", "Soft fill behind success tags."),
  color("warning", "Needs attention but not blocking; readable on white and on warning-soft."),
  color("warning-foreground", "Text on a solid warning fill."),
  color("warning-soft", "Soft amber fill behind warning tags and banners."),
  color("info", "Neutral informational status."),
  color("info-foreground", "Text on a solid info fill."),
  color("info-soft", "Soft blue fill behind info tags."),
  color("ai", "Glific AI violet. Never the brand green, so AI output is never mistaken for live state."),
  color("ai-foreground", "Text on a solid AI fill."),
  color("ai-soft", "Soft violet fill behind AI suggestions."),
  color("border", "Default border and divider colour."),
  color("input", "Form control border."),
  color("ring", "Focus ring."),
  color("chat-surface", "Conversation background (WhatsApp wallpaper tone)."),
  color("chat-inbound", "Bubble for messages from the contact."),
  color("chat-outbound", "Bubble for messages sent by Glific or staff."),
  color("chat-meta", "Timestamps and meta text inside bubbles."),
  color("chat-read", "Blue double tick: message read."),
  color("whatsapp", "WhatsApp brand green, for the channel mark only."),
] as const satisfies readonly TokenDefinition[];

export const chartTokens = [1, 2, 3, 4, 5].map(
  (n): TokenDefinition => ({
    name: `chart-${n}`,
    group: "chart",
    description: `Categorical chart series ${n}.`,
    utility: `chart-${n}`,
  }),
);

export const sidebarTokens = [
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
].map(
  (name): TokenDefinition => ({
    name,
    group: "sidebar",
    description: `Sidebar ${name === "sidebar" ? "surface" : name.replace("sidebar-", "")}.`,
    utility: name,
  }),
);

export const radiusTokens: readonly TokenDefinition[] = [
  { name: "radius", group: "radius", description: "Base corner radius; rounded-sm..4xl derive from it." },
];

export const fontTokens: readonly TokenDefinition[] = [
  { name: "font-family-sans", group: "font", description: "UI font (brand placeholder).", utility: "font-sans" },
  { name: "font-family-mono", group: "font", description: "Code and IDs.", utility: "font-mono" },
];

export const typographyScale = ["display", "title", "heading", "subheading", "body", "body-sm", "caption"] as const;
export type TypographyStep = (typeof typographyScale)[number];

const typographyDescriptions: Record<TypographyStep, string> = {
  display: "Hero numbers and empty-state headlines.",
  title: "Page titles (PageHeader).",
  heading: "Section and card headings.",
  subheading: "Sub-section headings, dialog titles.",
  body: "Default UI text.",
  "body-sm": "Dense tables and secondary text.",
  caption: "Labels, timestamps, helper text.",
};

export const typographyTokens: readonly TokenDefinition[] = typographyScale.map((step) => ({
  name: `text-${step}`,
  group: "typography",
  description: typographyDescriptions[step],
  utility: `text-${step}`,
}));

export const spacingScale = ["page", "section", "stack", "inline"] as const;

const spacingDescriptions: Record<(typeof spacingScale)[number], string> = {
  page: "Page edge, 40px (px-page).",
  section: "Gap between page sections (gap-section, mt-section).",
  stack: "Gap between stacked items in a section (gap-stack).",
  inline: "Gap between inline items: icon + label, button groups (gap-inline).",
};

export const spacingTokens: readonly TokenDefinition[] = spacingScale.map((step) => ({
  name: `spacing-${step}`,
  group: "spacing",
  description: spacingDescriptions[step],
  utility: step,
}));

export const tokens: readonly TokenDefinition[] = [
  ...colorTokens,
  ...chartTokens,
  ...sidebarTokens,
  ...radiusTokens,
  ...fontTokens,
  ...typographyTokens,
  ...spacingTokens,
];
