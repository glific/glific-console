import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { useDebouncedValue } from "@/lib/use-debounced-value";

type AsyncSearchSelectProps = {
  queryKey: readonly unknown[];
  search: (text: string) => Promise<ComboboxOption[]>;
  selectedOptions?: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
} & (
  | { multiple?: false; value: string | null; onValueChange: (value: string | null) => void }
  | { multiple: true; value: string[]; onValueChange: (value: string[]) => void }
);

export function AsyncSearchSelect({ queryKey, search, ...props }: AsyncSearchSelectProps) {
  const [text, setText] = useState("");
  const debounced = useDebouncedValue(text.trim());
  const results = useQuery({
    queryKey: [...queryKey, "search", debounced],
    queryFn: () => search(debounced),
    placeholderData: (previous) => previous,
  });
  return <Combobox {...props} options={results.data ?? []} onSearchChange={setText} loading={results.isPending} />;
}
