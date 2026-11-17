import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onValueChange: (date: Date | undefined) => void;
  placeholder?: string;
  fromDate?: Date;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function DatePicker({
  value,
  onValueChange,
  placeholder,
  fromDate,
  id,
  disabled,
  className,
  ...props
}: DatePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const text = value ? format(value, "d MMM yyyy") : (placeholder ?? t("datePicker.placeholder"));
  // The accessible name must contain the visible text (WCAG 2.5.3), so the label is prefixed to it.
  const name = props["aria-label"] ? `${props["aria-label"]}: ${text}` : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={name}
          data-empty={!value || undefined}
          className={cn("w-full justify-start font-normal data-empty:text-muted-foreground", className)}
        >
          <CalendarIcon aria-hidden="true" data-icon="inline-start" />
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        aria-label={props["aria-label"] ?? placeholder ?? t("datePicker.placeholder")}
      >
        <Calendar
          mode="single"
          autoFocus
          selected={value}
          onSelect={(date) => {
            onValueChange(date);
            setOpen(false);
          }}
          {...(fromDate ? { disabled: { before: fromDate } } : {})}
          {...(value ? { defaultMonth: value } : {})}
        />
      </PopoverContent>
    </Popover>
  );
}
