import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { AsyncSearchSelect } from "./async-search-select";

const collections = [
  { value: "1", label: "Farmers" },
  { value: "2", label: "Field staff" },
  { value: "3", label: "Teachers" },
];

function Harness({ search }: { search: (text: string) => Promise<typeof collections> }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <AsyncSearchSelect
      queryKey={["collections"]}
      search={search}
      value={value}
      onValueChange={setValue}
      aria-label="Collection"
    />
  );
}

describe("AsyncSearchSelect", () => {
  it("searches the server as the user types and selects a result", async () => {
    const search = vi.fn(async (text: string) =>
      collections.filter((c) => c.label.toLowerCase().includes(text.toLowerCase())),
    );
    renderWithProviders(<Harness search={search} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Collection" }));
    await expect.element(screen.getByRole("option", { name: "Teachers" })).toBeVisible();
    await expectNoA11yViolations();

    await userEvent.keyboard("fi");
    await expect.poll(() => search.mock.lastCall?.[0]).toBe("fi");
    await expect.element(screen.getByRole("option", { name: "Field staff" })).toBeVisible();
    expect(screen.queryByRole("option", { name: "Teachers" })).toBeNull();
    expect(search).not.toHaveBeenCalledWith("f");

    await userEvent.click(screen.getByRole("option", { name: "Field staff" }));
    await expect.element(screen.getByRole("combobox", { name: "Collection" })).toHaveTextContent("Field staff");
  });
});
