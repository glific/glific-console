// src/components/ui is owned shadcn code: arbitrary values, inline styles, native controls and Radix are allowed here.
import { Slot } from "radix-ui";

export function RawButton() {
  return (
    <button type="button" className="h-[30px] rounded-[min(var(--radius-md),12px)]" style={{ inset: 0 }}>
      {String(Slot)}
    </button>
  );
}
