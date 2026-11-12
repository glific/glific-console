import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  group?: string
  disabled?: boolean
}

interface ComboboxBaseProps {
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  id?: string
  className?: string
  "aria-label"?: string
  "aria-invalid"?: boolean
}

type ComboboxProps = ComboboxBaseProps &
  (
    | {
        multiple?: false
        value: string | null
        onValueChange: (value: string | null) => void
      }
    | {
        multiple: true
        value: string[]
        onValueChange: (value: string[]) => void
      }
  )

function groupOptions(options: ComboboxOption[]) {
  const groups = new Map<string, ComboboxOption[]>()
  for (const option of options) {
    const key = option.group ?? ""
    groups.set(key, [...(groups.get(key) ?? []), option])
  }
  return [...groups.entries()]
}

function Combobox(props: ComboboxProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const {
    options,
    placeholder,
    searchPlaceholder,
    emptyText,
    disabled,
    id,
    className,
  } = props
  const selected = props.multiple
    ? props.value
    : props.value
      ? [props.value]
      : []
  const labelOf = (value: string) =>
    options.find((o) => o.value === value)?.label ?? value

  function toggle(value: string) {
    if (props.multiple) {
      props.onValueChange(
        props.value.includes(value)
          ? props.value.filter((v) => v !== value)
          : [...props.value, value],
      )
    } else {
      props.onValueChange(props.value === value ? null : value)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={props["aria-label"]}
          aria-invalid={props["aria-invalid"]}
          disabled={disabled}
          data-slot="combobox-trigger"
          className={cn(
            "h-auto min-h-8 w-full justify-between font-normal",
            className,
          )}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">
                {placeholder ?? t("combobox.placeholder")}
              </span>
            ) : props.multiple ? (
              selected.map((value) => (
                <Badge key={value} variant="neutral">
                  {labelOf(value)}
                </Badge>
              ))
            ) : (
              <span className="truncate">{labelOf(selected[0] as string)}</span>
            )}
          </span>
          <ChevronsUpDownIcon
            aria-hidden="true"
            className="text-muted-foreground"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        aria-label={
          props["aria-label"] ?? placeholder ?? t("combobox.placeholder")
        }
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder ?? t("combobox.search")}
          />
          <CommandList>
            <CommandEmpty>{emptyText ?? t("combobox.empty")}</CommandEmpty>
            {groupOptions(options).map(([group, items]) => (
              <CommandGroup key={group || "_"} heading={group || undefined}>
                {items.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    disabled={option.disabled}
                    onSelect={() => toggle(option.value)}
                    data-checked={selected.includes(option.value)}
                  >
                    {option.label}
                    <CheckIcon
                      aria-hidden="true"
                      className={cn(
                        "ml-auto",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
