import {
  AlertTriangleIcon,
  BotIcon,
  MessageSquareIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
  WorkflowIcon,
  ZapIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { radiusTokens, spacingTokens, typographyTokens } from "@/styles/tokens";
import { BrandColours, Palette } from "./palette";
import type { CatalogSection } from "./sections";

// Tailwind only generates classes it can see as literal strings.
const typeClass: Record<string, string> = {
  "text-display": "text-display",
  "text-title": "text-title",
  "text-heading": "text-heading",
  "text-subheading": "text-subheading",
  "text-body": "text-body",
  "text-body-sm": "text-body-sm",
  "text-caption": "text-caption",
};
const typeSize: Record<string, string> = {
  "text-display": "30 / 36 · semibold",
  "text-title": "24 / 32 · semibold",
  "text-heading": "18 / 28 · semibold",
  "text-subheading": "16 / 24 · medium",
  "text-body": "14 / 22 · regular",
  "text-body-sm": "12 / 18 · regular",
  "text-caption": "11 / 16 · regular",
};
const spacingClass: Record<string, string> = {
  page: "w-page",
  section: "w-section",
  stack: "w-stack",
  inline: "w-inline",
};
const spacingPx: Record<string, string> = { page: "40px", section: "24px", stack: "16px", inline: "8px" };
const radii = [
  { name: "rounded-sm", px: "7px", className: "rounded-sm", use: "Tags, small marks" },
  { name: "rounded-md", px: "10px", className: "rounded-md", use: "Inputs, buttons" },
  { name: "rounded-lg", px: "12px", className: "rounded-lg", use: "Fields, menus" },
  { name: "rounded-xl", px: "17px", className: "rounded-xl", use: "Cards, dialogs" },
  { name: "rounded-full", px: "pill", className: "rounded-full", use: "Avatars, pills, send button" },
];
const weights = [
  { label: "Regular 400", className: "font-normal" },
  { label: "Medium 500", className: "font-medium" },
  { label: "Semibold 600", className: "font-semibold" },
  { label: "Bold 700", className: "font-bold" },
];

const principles = [
  {
    title: "One green, used sparingly",
    body: "The brand green means “this is the main action” or “this is live”. One filled green button per view; everything else is quieter.",
  },
  {
    title: "AI is violet",
    body: "Glific AI never borrows the brand colour, so a suggestion is never mistaken for something published or live.",
  },
  {
    title: "Hindi and Marathi are first-class",
    body: "Devanagari is in the font stack everywhere, not bolted on. Test every screen with a long Hindi label.",
  },
  {
    title: "Every list has a loading, empty and error state",
    body: "Skeletons while loading, an EmptyState with a next step, and an ErrorState with “Try again”.",
  },
  {
    title: "Accessible by default",
    body: "AA contrast, visible focus, full keyboard use and labelled controls. Tests fail if a component breaks these.",
  },
  {
    title: "Tokens, not values",
    body: "Colours, sizes and spacing come from tokens. Raw hex values and one-off pixel sizes fail lint.",
  },
];

export const foundations: CatalogSection[] = [
  {
    id: "overview",
    group: "Foundations",
    title: "Principles",
    description: "How Glific 2.0 looks and behaves, in six rules.",
    content: (
      <div className="grid gap-stack sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle, index) => (
          <div key={principle.title} className="flex flex-col gap-1 rounded-xl bg-shell p-stack">
            <span className="text-caption font-semibold text-primary">0{index + 1}</span>
            <h3 className="text-subheading">{principle.title}</h3>
            <p className="text-body-sm text-muted-foreground">{principle.body}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "brand",
    group: "Foundations",
    title: "Brand",
    description:
      "Glific's 2026 brand book greens. Deep green is the primary; the darkest is hover; the soft green is for selected states.",
    content: (
      <div className="flex flex-col gap-section">
        <div className="flex flex-wrap items-center gap-section rounded-2xl bg-primary px-section py-10 text-primary-foreground">
          <span className="text-display tracking-tight">glific</span>
          <span className="max-w-md text-body opacity-90">
            Two-way WhatsApp conversations for the social sector. Calm, clear and built for the people NGOs serve.
          </span>
        </div>
        <BrandColours />
      </div>
    ),
  },
  {
    id: "colours",
    group: "Foundations",
    title: "Colour",
    description:
      "Every colour once, by family. Hover a colour to see all tokens that use it. Use tokens as classes (bg-primary, text-muted-foreground), never raw values.",
    content: <Palette />,
  },
  {
    id: "typography",
    group: "Foundations",
    title: "Typography",
    description:
      "Google Sans Flex for Latin, Noto Sans Devanagari for Hindi and Marathi. Both self-hosted and variable.",
    content: (
      <div className="flex flex-col gap-section">
        <div className="grid gap-stack md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border p-section">
            <span className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">
              Primary typeface
            </span>
            <span className="text-title">Google Sans Flex</span>
            <span className="text-display leading-none">Aa Bb Gg 123</span>
            <span className="text-body-sm text-muted-foreground">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 ₹ % @ ?
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border p-section">
            <span className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">Devanagari</span>
            <span className="text-title" lang="hi">
              Noto Sans Devanagari
            </span>
            <span className="text-display leading-none" lang="hi">
              नमस्ते
            </span>
            <span className="text-body-sm text-muted-foreground" lang="mr">
              आपले स्वागत आहे · तुमची भाषा निवडा · पुढे जा
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-section">
          {weights.map((weight) => (
            <div key={weight.label} className="flex flex-col">
              <span className={`text-heading ${weight.className}`}>Glific</span>
              <span className="text-caption text-muted-foreground">{weight.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y rounded-xl border">
          {typographyTokens.map((token) => (
            <div key={token.name} className="grid items-baseline gap-2 px-stack py-3 sm:grid-cols-4">
              <span className="font-mono text-caption text-muted-foreground">
                {token.name}
                <br />
                {typeSize[token.name]}
              </span>
              <span className={`sm:col-span-2 ${typeClass[token.name] ?? ""}`}>Send a welcome message</span>
              <span className="text-caption text-muted-foreground">{token.description}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "layout",
    group: "Foundations",
    title: "Spacing and shape",
    description: "A 4px grid with four named steps for layout, and a small set of corner radii.",
    content: (
      <div className="grid gap-section md:grid-cols-2">
        <div className="flex flex-col gap-stack">
          <h3 className="text-subheading">Spacing</h3>
          {spacingTokens.map((token) => (
            <div key={token.name} className="flex items-center gap-stack">
              <span className="w-24 shrink-0 font-mono text-caption text-muted-foreground">
                {token.utility} · {spacingPx[token.utility ?? ""]}
              </span>
              <div
                aria-hidden="true"
                className={`h-4 rounded-sm bg-primary ${spacingClass[token.utility ?? ""] ?? ""}`}
              />
              <span className="text-caption text-muted-foreground">{token.description}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-stack">
          <h3 className="text-subheading">Corners</h3>
          <p className="text-body-sm text-muted-foreground">{radiusTokens[0]?.description}</p>
          <div className="flex flex-wrap gap-stack">
            {radii.map((radius) => (
              <div key={radius.name} className="flex w-24 flex-col gap-1">
                <div
                  aria-hidden="true"
                  className={`size-16 border-2 border-primary bg-primary-soft ${radius.className}`}
                />
                <span className="font-mono text-caption">{radius.name}</span>
                <span className="text-caption text-muted-foreground">{radius.use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "iconography",
    group: "Foundations",
    title: "Icons",
    description:
      "Lucide icons at 16px in UI, 14px in dense rows, 24px in empty states. Icons next to text are hidden from screen readers; icon-only buttons need a label.",
    content: (
      <div className="flex flex-col gap-stack">
        <div className="flex flex-wrap gap-section text-foreground">
          {[
            { Icon: MessageSquareIcon, name: "Chats" },
            { Icon: WorkflowIcon, name: "Flows" },
            { Icon: UsersIcon, name: "Contacts" },
            { Icon: ZapIcon, name: "Quick reply" },
            { Icon: SearchIcon, name: "Search" },
            { Icon: AlertTriangleIcon, name: "Problem" },
            { Icon: BotIcon, name: "Assistant" },
            { Icon: SparklesIcon, name: "Glific AI" },
          ].map(({ Icon, name }) => (
            <span key={name} className="flex w-16 flex-col items-center gap-1">
              <Icon aria-hidden="true" className="size-6" />
              <span className="text-caption text-muted-foreground">{name}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-inline">
          <Button>
            <WorkflowIcon data-icon="inline-start" />
            New flow
          </Button>
          <Badge variant="ai">
            <SparklesIcon /> Suggested by AI
          </Badge>
        </div>
      </div>
    ),
  },
];
