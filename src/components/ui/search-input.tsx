import { SearchIcon, XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

interface SearchInputProps
  extends Omit<
    ComponentProps<typeof InputGroupInput>,
    "value" | "onChange" | "type"
  > {
  value: string
  onValueChange: (value: string) => void
  label?: string
}

export function SearchInput({
  value,
  onValueChange,
  label,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  const { t } = useTranslation()
  return (
    <InputGroup className={cn("max-w-sm", className)}>
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault()
            onValueChange("")
          }
        }}
        placeholder={placeholder ?? t("search.placeholder")}
        aria-label={label ?? placeholder ?? t("search.placeholder")}
        {...props}
      />
      {value ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={t("search.clear")}
            onClick={() => onValueChange("")}
          >
            <XIcon aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
