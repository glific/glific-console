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
  /** Dates before this can't be picked, e.g. today for scheduling. */
  fromDate?: Date;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Date field that opens a calendar (live app Calendar / DateTimePicker), for triggers, broadcasts and filters. */
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
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={props["aria-label"]}
          data-empty={!value || undefined}
          className={cn("w-full justify-start font-normal data-empty:text-muted-foreground", className)}
        >
          <CalendarIcon aria-hidden="true" data-icon="inline-start" />
          {value ? format(value, "d MMM yyyy") : (placeholder ?? t("datePicker.placeholder"))}
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
