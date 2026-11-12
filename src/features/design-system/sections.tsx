import { CopyIcon, InboxIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/*
 * Internal catalog page. The sample copy below ("Rename flow", "Asha Kulkarni") is demo fixture data, not product
 * UI, so it is intentionally not routed through i18n.
 */

export interface CatalogSection {
  id: string;
  /** Table-of-contents group. */
  group?: "Foundations" | "Components" | "Glific patterns";
  title: string;
  description: string;
  content: ReactNode;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-inline">{children}</div>
    </div>
  );
}

const buttonVariants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
const badgeVariants = ["default", "secondary", "outline", "destructive", "ghost", "link"] as const;
const badgeTones = ["neutral", "success", "warning", "danger", "info", "ai"] as const;

export const sections: CatalogSection[] = [
  {
    group: "Components",
    id: "button",
    title: "Button",
    description: "components/ui/button. Add a variant here instead of creating a new button component.",
    content: (
      <div className="flex flex-col gap-stack">
        <Row label="Variants">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Row>
        <Row label="Sizes">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
        </Row>
        <Row label="With icon, loading, disabled">
          <Button>
            <PlusIcon data-icon="inline-start" />
            New flow
          </Button>
          <Button disabled>
            <Spinner size="sm" label="Saving" />
            Saving
          </Button>
          <Button disabled variant="outline">
            Disabled
          </Button>
        </Row>
      </div>
    ),
  },
  {
    group: "Components",
    id: "badge",
    title: "Badge",
    description: "components/ui/badge",
    content: (
      <div className="flex flex-col gap-stack">
        <Row label="Variants">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </Row>
        <Row label="Status tones (tags, pills)">
          {badgeTones.map((tone) => (
            <Badge key={tone} variant={tone}>
              {tone}
            </Badge>
          ))}
        </Row>
      </div>
    ),
  },
  {
    group: "Components",
    id: "form",
    title: "Form controls",
    description: "Input, Textarea, Select, Checkbox, Switch, RadioGroup, composed with Field for labels and errors.",
    content: (
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel htmlFor="catalog-name">Flow name</FieldLabel>
          <Input id="catalog-name" placeholder="Welcome flow" />
          <FieldDescription>Shown to your team only.</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="catalog-keyword">Keyword</FieldLabel>
          <Input id="catalog-keyword" aria-invalid defaultValue="hi there" aria-describedby="catalog-keyword-error" />
          <FieldError id="catalog-keyword-error" errors={[{ message: "Keywords can't contain spaces" }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="catalog-message">Message</FieldLabel>
          <Textarea id="catalog-message" placeholder="Hi! Reply 1 for English, 2 for Hindi." />
        </Field>
        <Field>
          <FieldLabel htmlFor="catalog-language">Language</FieldLabel>
          <Select>
            <SelectTrigger id="catalog-language">
              <SelectValue placeholder="Choose a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="catalog-optin" defaultChecked />
          <FieldLabel htmlFor="catalog-optin">Only opted-in contacts</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id="catalog-notify" />
          <FieldLabel htmlFor="catalog-notify">Notify me when it fails</FieldLabel>
        </Field>
        <RadioGroup defaultValue="now" aria-label="Send time">
          {[
            { value: "now", label: "Send now" },
            { value: "later", label: "Schedule for later" },
          ].map((option) => (
            <div key={option.value} className="flex items-center gap-inline">
              <RadioGroupItem id={`catalog-${option.value}`} value={option.value} />
              <Label htmlFor={`catalog-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </FieldGroup>
    ),
  },
  {
    group: "Components",
    id: "card",
    title: "Card",
    description: "components/ui/card",
    content: (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Messages today</CardTitle>
          <CardDescription>Across all active flows</CardDescription>
          <CardAction>
            <Badge variant="secondary">+12%</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-display">1,204</CardContent>
        <CardFooter className="text-caption text-muted-foreground">Updated just now</CardFooter>
      </Card>
    ),
  },
  {
    group: "Components",
    id: "tabs",
    title: "Tabs",
    description: "components/ui/tabs, default and line variants",
    content: (
      <div className="flex flex-col gap-section">
        {(["default", "line"] as const).map((variant) => (
          <Tabs key={variant} defaultValue="flows">
            <TabsList variant={variant} aria-label={`Library (${variant})`}>
              <TabsTrigger value="flows">Flows</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="forms">WhatsApp Forms</TabsTrigger>
            </TabsList>
            <TabsContent value="flows" className="text-body text-muted-foreground">
              Flows tab ({variant})
            </TabsContent>
            <TabsContent value="templates" className="text-body text-muted-foreground">
              Templates tab
            </TabsContent>
            <TabsContent value="forms" className="text-body text-muted-foreground">
              WhatsApp Forms tab
            </TabsContent>
          </Tabs>
        ))}
      </div>
    ),
  },
  {
    group: "Components",
    id: "table",
    title: "Table",
    description: "components/ui/table",
    content: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flow</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Runs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { name: "Welcome", status: "Published", runs: "8,412" },
            { name: "Registration", status: "Draft", runs: "0" },
          ].map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                <Badge variant={row.status === "Published" ? "secondary" : "outline"}>{row.status}</Badge>
              </TableCell>
              <TableCell className="text-right">{row.runs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
  {
    group: "Components",
    id: "avatar",
    title: "Avatar, Skeleton, Separator",
    description: "Display primitives",
    content: (
      <div className="flex flex-col gap-stack">
        <Row label="Avatar sizes and group">
          <Avatar size="sm">
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>RV</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>MI</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>RV</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </Row>
        <Separator />
        <Row label="Skeleton">
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10" />
          </div>
        </Row>
      </div>
    ),
  },
  {
    group: "Components",
    id: "overlays",
    title: "Overlays",
    description: "Dialog, AlertDialog, Sheet, DropdownMenu, Popover, Tooltip and toasts",
    content: (
      <Row label="Click to open">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename flow</DialogTitle>
              <DialogDescription>Give this flow a name your team will recognise.</DialogDescription>
            </DialogHeader>
            <Input aria-label="Flow name" defaultValue="Welcome flow" />
            <DialogFooter showCloseButton>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Alert dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this flow?</AlertDialogTitle>
              <AlertDialogDescription>Contacts currently in it will stop receiving messages.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Asha Kulkarni</SheetTitle>
              <SheetDescription>+91 98765 00001 · Opted in</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button>Send message</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More actions">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Flow</DropdownMenuLabel>
            <DropdownMenuItem>
              <CopyIcon />
              Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Pinned</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Popover</Button>
          </PopoverTrigger>
          <PopoverContent aria-labelledby="catalog-popover-title">
            <PopoverHeader>
              <PopoverTitle id="catalog-popover-title">Filter contacts</PopoverTitle>
              <PopoverDescription>Show only contacts who opted in.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate flow</TooltipContent>
        </Tooltip>

        <Button variant="secondary" onClick={() => toast.success("Flow published")}>
          Success toast
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Couldn't publish the flow")}>
          Error toast
        </Button>
      </Row>
    ),
  },
  {
    group: "Components",
    id: "composed",
    title: "Composed components",
    description: "src/components: PageHeader, EmptyState, ErrorState, Spinner",
    content: (
      <div className="flex flex-col gap-section">
        <Row label="EmptyState">
          <EmptyState
            className="w-full"
            headingLevel={3}
            icon={<InboxIcon />}
            title="No flows yet"
            description="Create your first flow to start talking to contacts."
            action={<Button>Create flow</Button>}
          />
        </Row>
        <Row label="ErrorState">
          <ErrorState className="w-full rounded-lg border" title="Couldn't load flows" onRetry={() => {}} />
        </Row>
        <Row label="Spinner">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </Row>
        <Row label="PageHeader (renders the page h1, so it is shown last)">
          <PageHeader
            className="w-full rounded-lg border p-stack"
            title="Flows"
            description="Build and manage conversations."
            actions={
              <>
                <Button variant="outline">Import</Button>
                <Button>
                  <PlusIcon data-icon="inline-start" />
                  New flow
                </Button>
              </>
            }
          />
        </Row>
      </div>
    ),
  },
];
