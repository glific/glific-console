import {
  AlertCircleIcon,
  BoldIcon,
  CopyIcon,
  InfoIcon,
  ItalicIcon,
  ListIcon,
  MessageSquareIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { EmptyState } from "@/components/empty-state";
import { HelpTip } from "@/components/help-tip";
import { StatTile } from "@/components/stat-tile";
import { StatusDot } from "@/components/status-dot";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { IconButton } from "@/components/ui/icon-button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ListMessage,
  LocationRequestMessage,
  QuickReplyMessage,
  TemplateMessage,
  WhatsAppPreview,
} from "@/components/whatsapp";
import { AiDemo } from "./ai-demo";
import { ChatDemo } from "./chat-demo";
import { ChatListDemo } from "./chat-list-demo";
import { DataTableDemo } from "./data-table-demo";
import { DemoRow } from "./demo-row";
import { FormDemo } from "./form-demo";
import { MediaDemo } from "./media-demo";
import { PickersDemo } from "./pickers-demo";
import type { CatalogSection } from "./sections";

const chartConfig = {
  sent: { label: "Sent", color: "var(--chart-1)" },
  read: { label: "Read", color: "var(--chart-2)" },
} satisfies ChartConfig;

const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  sent: 400 + ((i * 137) % 300),
  read: 250 + ((i * 89) % 200),
}));

export const moreSections: CatalogSection[] = [
  {
    group: "Glific patterns",
    id: "chat",
    title: "Chat",
    description:
      "components/chat: header, bubbles with ticks, errors and quick-reply buttons, notices, and the message box (type / for quick replies).",
    content: (
      <div className="flex w-full flex-col gap-section">
        <ChatDemo />
        <DemoRow label="Conversation list">
          <ChatListDemo />
        </DemoRow>
        <DemoRow label="Media messages">
          <MediaDemo />
        </DemoRow>
      </div>
    ),
  },
  {
    group: "Glific patterns",
    id: "whatsapp",
    title: "WhatsApp preview",
    description: "components/whatsapp: how templates and interactive messages look on the contact's phone.",
    content: (
      <div className="flex flex-wrap gap-section">
        <WhatsAppPreview businessName="Glific">
          <TemplateMessage
            header="Admissions open"
            body={"Hi *Asha*, admissions for the tailoring course close on _30 Nov_."}
            footer="Reply STOP to opt out"
            buttons={[
              { type: "quick_reply", text: "Apply now" },
              { type: "url", text: "Course details", url: "https://glific.org" },
            ]}
            time="10:00"
          />
          <QuickReplyMessage
            body="Which language do you prefer?"
            options={["English", "हिन्दी", "मराठी"]}
            time="10:01"
          />
        </WhatsAppPreview>
        <WhatsAppPreview businessName="Glific">
          <ListMessage
            body="Pick a course to learn more"
            buttonText="See courses"
            sections={[
              {
                title: "Skills",
                items: [
                  { title: "Tailoring", description: "6 weeks" },
                  { title: "Computers", description: "8 weeks" },
                ],
              },
              { title: "Health", items: [{ title: "First aid" }] },
            ]}
            expanded
          />
          <LocationRequestMessage body="Share your location to find the nearest centre." />
        </WhatsAppPreview>
      </div>
    ),
  },
  {
    group: "Glific patterns",
    id: "ai",
    title: "Glific AI",
    description:
      "components/ai: always violet, never the brand green, so AI suggestions can't be mistaken for live state.",
    content: <AiDemo />,
  },
  {
    group: "Components",
    id: "data-table",
    title: "Data table",
    description:
      "components/data-table: sortable columns, row selection with a selection bar, pagination (client or server).",
    content: <DataTableDemo />,
  },
  {
    group: "Components",
    id: "pickers",
    title: "Pickers and inputs",
    description: "Combobox (single and multi), date and time pickers, server search select, search, file upload.",
    content: <PickersDemo />,
  },
  {
    group: "Components",
    id: "forms",
    title: "Forms",
    description:
      "components/form: useZodForm, FormField (label, hint, error), FormSection, FormActions, UnsavedChangesGuard.",
    content: <FormDemo />,
  },
  {
    group: "Components",
    id: "feedback",
    title: "Feedback and status",
    description: "Alert, Progress, StatusDot, StatTile, HelpTip, Kbd",
    content: (
      <div className="flex w-full flex-col gap-stack">
        <div className="grid gap-stack md:grid-cols-2">
          <Alert>
            <InfoIcon />
            <AlertTitle>Template sent for approval</AlertTitle>
            <AlertDescription>Meta usually replies within a day.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Webhook failing</AlertTitle>
            <AlertDescription>12 contacts are stuck at “Send certificate”.</AlertDescription>
          </Alert>
        </div>
        <DemoRow label="Progress">
          <Progress value={64} aria-label="Import progress" className="max-w-sm" />
        </DemoRow>
        <DemoRow label="Status dots">
          {(["success", "warning", "danger", "info", "ai", "neutral"] as const).map((tone) => (
            <span key={tone} className="inline-flex items-center gap-1.5 text-body-sm">
              <StatusDot tone={tone} />
              {tone}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-body-sm">
            <StatusDot tone="live" pulse /> live
          </span>
        </DemoRow>
        <div className="grid gap-stack sm:grid-cols-3">
          <StatTile label="Messages today" value="1,204" icon={MessageSquareIcon} trend={12} sub="across 8 flows" />
          <StatTile label="Active contacts" value="8,412" icon={UsersIcon} trend={3} />
          <StatTile label="Opt-outs" value="9" trend={-2} />
        </div>
        <DemoRow label="Help tip and keyboard hint">
          <span className="inline-flex items-center gap-1 text-body">
            Keyword
            <HelpTip label="About keywords">Contacts send this word to start the flow.</HelpTip>
          </span>
          <span className="text-body-sm text-muted-foreground">
            Search with{" "}
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </span>
        </DemoRow>
      </div>
    ),
  },
  {
    group: "Components",
    id: "navigation",
    title: "Navigation and disclosure",
    description: "Breadcrumb, Pagination, Accordion, Collapsible, HoverCard, Command, ScrollArea",
    content: (
      <div className="flex w-full flex-col gap-section">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation">Flows</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#navigation">Onboarding</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Registration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination className="justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#navigation" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#navigation">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#navigation" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#navigation" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Accordion type="single" collapsible className="max-w-xl">
          <AccordionItem value="window">
            <AccordionTrigger>What is the 24-hour window?</AccordionTrigger>
            <AccordionContent>After a contact messages you, you can reply freely for 24 hours.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="template">
            <AccordionTrigger>When do I need a template?</AccordionTrigger>
            <AccordionContent>To message someone outside the window.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Collapsible className="max-w-xl">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Advanced settings
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2.5 py-2 text-body text-muted-foreground">
            Webhook timeout: 30 seconds
          </CollapsibleContent>
        </Collapsible>
        <DemoRow label="Hover card">
          <HoverCard>
            <HoverCardTrigger href="#navigation" className="text-body text-primary underline-offset-4 hover:underline">
              Batch A
            </HoverCardTrigger>
            <HoverCardContent className="text-body-sm">124 contacts · created 2 Nov</HoverCardContent>
          </HoverCard>
        </DemoRow>
        <Command label="Go to" className="max-w-sm rounded-lg border">
          <CommandInput placeholder="Go to…" />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem>
                <WorkflowIcon /> Flows
              </CommandItem>
              <CommandItem>
                <UsersIcon /> Contacts
              </CommandItem>
              <CommandItem>
                <MessageSquareIcon /> Chats
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <ScrollArea className="h-32 max-w-sm rounded-lg border" aria-label="Recent activity">
          <div className="flex flex-col gap-1 p-3 text-body-sm">
            {Array.from({ length: 15 }, (_, i) => `Flow “Welcome” ran for contact ${i + 1}`).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </ScrollArea>
      </div>
    ),
  },
  {
    group: "Components",
    id: "controls",
    title: "More controls",
    description: "ToggleGroup (segmented control), Toggle, Slider, ButtonGroup, InputGroup, Item",
    content: (
      <div className="flex w-full flex-col gap-stack">
        <DemoRow label="Segmented control and toggles">
          <ToggleGroup type="single" defaultValue="list" variant="outline" aria-label="View">
            <ToggleGroupItem value="list">
              <ListIcon /> List
            </ToggleGroupItem>
            <ToggleGroupItem value="folders">Folders</ToggleGroupItem>
          </ToggleGroup>
          <Toggle aria-label="Bold">
            <BoldIcon />
          </Toggle>
          <Toggle aria-label="Italic" variant="outline">
            <ItalicIcon />
          </Toggle>
        </DemoRow>
        <DemoRow label="Slider">
          <Slider
            defaultValue={[30]}
            max={100}
            step={5}
            aria-label="Wait before reminder (minutes)"
            className="max-w-sm"
          />
        </DemoRow>
        <DemoRow label="Button group">
          <ButtonGroup aria-label="Publish">
            <Button variant="outline">Save draft</Button>
            <Button variant="outline">Test</Button>
            <Button>Publish</Button>
          </ButtonGroup>
        </DemoRow>
        <DemoRow label="Input group">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText>glific.org/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput aria-label="Organisation URL" defaultValue="pratham" />
          </InputGroup>
        </DemoRow>
        <Item variant="outline" className="max-w-xl">
          <ItemMedia variant="icon">
            <WorkflowIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Registration</ItemTitle>
            <ItemDescription>Published · 8,412 runs this month</ItemDescription>
          </ItemContent>
          <ItemActions>
            <IconButton icon={CopyIcon} label="Duplicate" size="sm" />
          </ItemActions>
        </Item>
      </div>
    ),
  },
  {
    group: "Components",
    id: "chart",
    title: "Chart",
    description: "components/ui/chart (recharts), coloured by the chart tokens.",
    content: (
      <ChartContainer
        config={chartConfig}
        className="h-64 w-full max-w-2xl"
        role="img"
        aria-label="Messages sent and read this week"
      >
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
          <Bar dataKey="read" fill="var(--color-read)" radius={4} />
        </BarChart>
      </ChartContainer>
    ),
  },
  {
    group: "Components",
    id: "empty-variants",
    title: "Empty states in context",
    description: "EmptyState composed inside a card, as list pages will use it.",
    content: (
      <EmptyState
        className="w-full"
        headingLevel={3}
        icon={<WorkflowIcon />}
        title="No flows in this folder"
        description="Move flows here or create a new one."
        action={<Button>Create flow</Button>}
      />
    ),
  },
];
