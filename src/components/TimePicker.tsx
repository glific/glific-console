import { ClockIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface TimePickerProps {
  /** 24-hour "HH:mm", or "" when empty. */
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  onBlur?: () => void;
}

export function TimePicker({ value, onValueChange, className, ...props }: TimePickerProps) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <ClockIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="time"
        step={60}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        {...props}
      />
    </InputGroup>
  );
}
