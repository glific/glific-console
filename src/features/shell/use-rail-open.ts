import { useState } from "react";
import { safeStorage } from "@/lib/storage";

const RAIL_KEY = "glific.rail";

/** Whether the rail is expanded, remembered in this browser. */
export function useRailOpen(): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(() => safeStorage.get(RAIL_KEY) !== "closed");
  return [
    open,
    (next: boolean) => {
      setOpen(next);
      safeStorage.set(RAIL_KEY, next ? "open" : "closed");
    },
  ];
}
