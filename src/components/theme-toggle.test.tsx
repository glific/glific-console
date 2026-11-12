import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("switches to dark from the keyboard and persists the choice", async () => {
    renderWithProviders(<ThemeToggle />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(screen.getByRole("menuitemradio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
    await expectNoA11yViolations(menu);
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it("passes axe in dark mode", async () => {
    renderWithProviders(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: "Change theme" }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "Dark" }));
    expect(document.documentElement).toHaveClass("dark");
    await expectNoA11yViolations();
    localStorage.removeItem(THEME_STORAGE_KEY);
  });
});
