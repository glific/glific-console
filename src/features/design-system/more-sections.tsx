import type { RowSelectionState } from "@tanstack/react-table";
import {
  AlertCircleIcon,
  BoldIcon,
  CopyIcon,
  FileTextIcon,
  InfoIcon,
  ItalicIcon,
  ListIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { AiMessage, PromptBox, PromptSuggestions, ThinkingIndicator } from "@/components/ai";
import {
  ChatComposer,
  ChatHeader,
  ConversationListItem,
  DayDivider,
  MessageBubble,
  MessageMedia,
  PollMessage,
  type QuickReply,
  SystemNotice,
} from "@/components/chat";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { DatePicker } from "@/components/date-picker";
import { EmptyState } from "@/components/empty-state";
import { HelpTip } from "@/components/help-tip";
import { SelectionBar } from "@/components/selection-bar";
import { StatTile } from "@/components/stat-tile";
import { StatusDot } from "@/components/status-dot";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Combobox } from "@/components/ui/combobox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileDropzone } from "@/components/ui/file-dropzone";
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
import { SearchInput } from "@/components/ui/search-input";
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
import type { CatalogSection } from "./sections";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-inline">{children}</div>
    </div>
  );
}

const quickReplies: QuickReply[] = [
  { key: "hello", name: "Greeting", text: "Hello! How can we help you today?" },
  { key: "helpline", name: "Helpline", text: "You can call our helpline on 1800-123-456." },
  { key: "callback", name: "Call back", text: "We'll call you back within a day." },
];

function ChatDemo() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border">
      <ChatHeader
        name="Asha Kulkarni"
        phone="+91 98765 00001"
        group="Batch A"
        hoursLeft={2}
        onInfo={() => {}}
        actions={<IconButton icon={MoreVerticalIcon} label="Contact options" />}
      />
      <div className="flex flex-col gap-2 bg-chat-surface px-6 py-4">
        <DayDivider>Today</DayDivider>
        <MessageBubble direction="inbound" text="Hi, I want to *register* for the tailoring course" time="10:02" />
        <MessageBubble
          direction="outbound"
          text="Welcome! Which language do you prefer?"
          time="10:02"
          status="read"
          buttons={["English", "हिन्दी", "मराठी"]}
          meta={<span>Registration › Language</span>}
        />
        <MessageBubble direction="inbound" text="हिन्दी" time="10:03" />
        <MessageBubble direction="outbound" time="10:03" status="delivered">
          <MessageMedia kind="document" name="course-details.pdf" detail="240 KB · PDF" />
        </MessageBubble>
        <MessageBubble direction="outbound" time="10:04" status="sent">
          <PollMessage question="Which batch suits you?" options={["Morning", "Evening"]} />
        </MessageBubble>
        <MessageBubble
          direction="outbound"
          text="Your certificate is ready"
          time="10:05"
          status="error"
          error="Webhook returned 500 from certificates.example.org"
          onErrorClick={() => {}}
        />
        <SystemNotice tone="success">Restarted from “Language”</SystemNotice>
        {sent.map((text, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: demo messages have no ids
          <MessageBubble key={index} direction="outbound" text={text} time="now" status="pending" />
        ))}
      </div>
      <div className="bg-chat-surface">
        <ChatComposer
          value={value}
          onValueChange={setValue}
          onSend={(text) => {
            setSent((s) => [...s, text]);
            setValue("");
          }}
          quickReplies={quickReplies}
          onAttach={() => {}}
          onRecord={() => {}}
          moreMenu={
            <>
              <DropdownMenuItem>
                <FileTextIcon /> Send a template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <WorkflowIcon /> Start a flow
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareIcon /> Interactive message
              </DropdownMenuItem>
            </>
          }
        />
      </div>
    </div>
  );
}

function ChatListDemo() {
  const [selected, setSelected] = useState("asha");
  const rows = [
    {
      id: "asha",
      name: "Asha Kulkarni",
      preview: "हिन्दी",
      time: "10:03",
      tone: "danger" as const,
      toneLabel: "Problem",
    },
    {
      id: "rahul",
      name: "Rahul Verma",
      preview: "When is the next class?",
      time: "09:41",
      unread: 2,
      tone: "warning" as const,
      toneLabel: "Waiting",
    },
    { id: "meera", name: "Meera Iyer", preview: "Thanks!", time: "Yesterday" },
  ];
  return (
    <div className="flex w-80 flex-col gap-0.5 rounded-xl border p-1">
      {rows.map((row) => (
        <ConversationListItem
          key={row.id}
          {...row}
          selected={selected === row.id}
          onSelect={() => setSelected(row.id)}
        />
      ))}
    </div>
  );
}

function MediaDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-2 rounded-xl bg-chat-surface p-4 sm:grid-cols-2">
      <MessageBubble direction="inbound" time="11:20">
        <MessageMedia kind="image" name="Photo of admit card" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:21">
        <MessageMedia kind="video" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:22">
        <MessageMedia kind="audio" detail="0:42" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:23">
        <MessageMedia
          kind="location"
          location={{ latitude: 19.04, longitude: 72.85, label: "Dharavi community centre" }}
        />
      </MessageBubble>
    </div>
  );
}

function AiDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-full max-w-xl flex-col gap-stack">
      <PromptSuggestions
        suggestions={["Build a registration flow", "Why do people drop off?", "Fix this flow's errors"]}
        onPick={setValue}
      />
      <PromptBox value={value} onValueChange={setValue} onSubmit={() => setValue("")} />
      <ThinkingIndicator />
      <AiMessage
        actions={
          <>
            <Button size="sm" className="bg-ai text-ai-foreground hover:bg-ai/90">
              Fix both
            </Button>
            <Button size="sm" variant="outline">
              Show me
            </Button>
          </>
        }
      >
        Two steps in “Registration” have no reply for Hindi. I can add the missing translations.
      </AiMessage>
    </div>
  );
}

interface FlowRow {
  id: string;
  name: string;
  status: "Published" | "Draft";
  runs: number;
  updated: string;
}

const flowRows: FlowRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: ["Welcome", "Registration", "Feedback", "Certificates", "Reminders", "Quiz"][i % 6] + (i >= 6 ? " v2" : ""),
  status: i % 3 === 0 ? "Draft" : "Published",
  runs: (i * 7919) % 9000,
  updated: `${(i % 28) + 1} Nov`,
}));

function DataTableDemo() {
  const columns = useMemo<DataTableColumn<FlowRow>[]>(
    () => [
      { accessorKey: "name", header: "Flow" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "Published" ? "success" : "neutral"}>{row.original.status}</Badge>
        ),
      },
      { accessorKey: "runs", header: "Runs" },
      { accessorKey: "updated", header: "Updated", enableSorting: false },
    ],
    [],
  );
  const [selection, setSelection] = useState<RowSelectionState>({});
  const count = Object.keys(selection).length;
  return (
    <div className="flex w-full flex-col gap-stack">
      <SelectionBar count={count} onClear={() => setSelection({})}>
        <Button size="sm" variant="outline">
          Duplicate
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </SelectionBar>
      <DataTable
        label="Flows"
        columns={columns}
        data={flowRows}
        getRowId={(row) => row.id}
        selectable
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        pageSize={5}
      />
    </div>
  );
}

function PickersDemo() {
  const [language, setLanguage] = useState<string | null>("hi");
  const [groups, setGroups] = useState<string[]>(["batch-a"]);
  const [date, setDate] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  return (
    <div className="grid w-full max-w-2xl gap-stack sm:grid-cols-2">
      <Combobox
        aria-label="Language"
        options={[
          { value: "en", label: "English" },
          { value: "hi", label: "Hindi" },
          { value: "mr", label: "Marathi" },
          { value: "ta", label: "Tamil" },
        ]}
        value={language}
        onValueChange={setLanguage}
      />
      <Combobox
        multiple
        aria-label="Collections"
        placeholder="Add to collections"
        options={[
          { value: "batch-a", label: "Batch A", group: "Students" },
          { value: "batch-b", label: "Batch B", group: "Students" },
          { value: "volunteers", label: "Volunteers", group: "Staff" },
        ]}
        value={groups}
        onValueChange={setGroups}
      />
      <DatePicker aria-label="Send on" value={date} onValueChange={setDate} fromDate={new Date()} />
      <SearchInput value={search} onValueChange={setSearch} placeholder="Search flows" />
      <div className="sm:col-span-2">
        <FileDropzone onFiles={() => {}} accept=".csv" hint="Contacts CSV, up to 5 MB" />
      </div>
    </div>
  );
}

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
        <Row label="Conversation list">
          <ChatListDemo />
        </Row>
        <Row label="Media messages">
          <MediaDemo />
        </Row>
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
    description: "Combobox (single and multi), date picker, search, file upload.",
    content: <PickersDemo />,
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
        <Row label="Progress">
          <Progress value={64} aria-label="Import progress" className="max-w-sm" />
        </Row>
        <Row label="Status dots">
          {(["success", "warning", "danger", "info", "ai", "neutral"] as const).map((tone) => (
            <span key={tone} className="inline-flex items-center gap-1.5 text-body-sm">
              <StatusDot tone={tone} />
              {tone}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-body-sm">
            <StatusDot tone="live" pulse /> live
          </span>
        </Row>
        <div className="grid gap-stack sm:grid-cols-3">
          <StatTile label="Messages today" value="1,204" icon={MessageSquareIcon} trend={12} sub="across 8 flows" />
          <StatTile label="Active contacts" value="8,412" icon={UsersIcon} trend={3} />
          <StatTile label="Opt-outs" value="9" trend={-2} />
        </div>
        <Row label="Help tip and keyboard hint">
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
        </Row>
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
        <Row label="Hover card">
          <HoverCard>
            <HoverCardTrigger href="#navigation" className="text-body text-primary underline-offset-4 hover:underline">
              Batch A
            </HoverCardTrigger>
            <HoverCardContent className="text-body-sm">124 contacts · created 2 Nov</HoverCardContent>
          </HoverCard>
        </Row>
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
        <Row label="Segmented control and toggles">
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
        </Row>
        <Row label="Slider">
          <Slider
            defaultValue={[30]}
            max={100}
            step={5}
            aria-label="Wait before reminder (minutes)"
            className="max-w-sm"
          />
        </Row>
        <Row label="Button group">
          <ButtonGroup aria-label="Publish">
            <Button variant="outline">Save draft</Button>
            <Button variant="outline">Test</Button>
            <Button>Publish</Button>
          </ButtonGroup>
        </Row>
        <Row label="Input group">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText>glific.org/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput aria-label="Organisation URL" defaultValue="pratham" />
          </InputGroup>
        </Row>
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
