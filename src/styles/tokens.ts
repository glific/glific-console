/**
 * Machine-readable manifest of the semantic tokens defined in tokens.css.
 * The component catalog reads this; tokens.test.ts keeps it in sync with the CSS.
 * Primitive --palette-* values are intentionally not listed: nothing outside tokens.css may use them.
 */

export type TokenGroup = "color" | "chart" | "sidebar" | "radius" | "font" | "typography" | "spacing";

export interface TokenDefinition {
  /** CSS custom property, without the leading `--`. */
  readonly name: string;
  readonly group: TokenGroup;
  readonly description: string;
  /** Tailwind utility stem this token is exposed as, e.g. `bg-primary` / `text-primary`. */
  readonly utility?: string;
}

const color = (name: string, description: string): TokenDefinition => ({
  name,
  group: "color",
  description,
  utility: name,
});

export const colorTokens = [
  color("background", "Default page background."),
  color("foreground", "Default text on background."),
  color("card", "Card surface."),
  color("card-foreground", "Text on card."),
  color("popover", "Popover, menu and tooltip surface."),
  color("popover-foreground", "Text on popover."),
  color("primary", "Brand colour for the main action on a screen."),
  color("primary-hover", "Primary on hover and press: darker, so text keeps its contrast."),
  color("primary-foreground", "Text and icons on primary."),
  color("secondary", "Lower-emphasis action surface."),
  color("secondary-foreground", "Text on secondary."),
  color("muted", "Subtle surface: table stripes, disabled fills."),
  color("muted-foreground", "De-emphasised text: hints, metadata."),
  color("accent", "Hover and selected surface for menu items and rows."),
  color("accent-foreground", "Text on accent."),
  color("destructive", "Errors and irreversible actions."),
  color("destructive-foreground", "Text on destructive."),
  color("success", "Positive status: sent, approved, healthy."),
  color("success-foreground", "Text on success."),
  color("warning", "Needs attention but not blocking."),
  color("warning-foreground", "Text on warning."),
  color("info", "Neutral informational status."),
  color("info-foreground", "Text on info."),
  color("border", "Default border and divider colour."),
  color("input", "Form control border."),
  color("ring", "Focus ring."),
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
  page: "Page gutter (p-page, px-page).",
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
