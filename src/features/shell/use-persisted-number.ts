import { useState } from "react";
import { safeStorage } from "@/lib/storage";

/** A number remembered in this browser, e.g. a panel width. */
export function usePersistedNumber(key: string, initial: number): [number, (value: number) => void] {
  const [value, setValue] = useState(() => {
    const stored = Number(safeStorage.get(key));
    return Number.isFinite(stored) && stored > 0 ? stored : initial;
  });
  return [
    value,
    (next: number) => {
      setValue(next);
      safeStorage.set(key, String(next));
    },
  ];
}
