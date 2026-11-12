import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { allSections } from "./all-sections";
import { DesignSystemPage } from "./design-system-page";
import { familyOf, paletteColours } from "./palette";

describe("DesignSystemPage", () => {
  it("renders every section with a heading and a contents link", async () => {
    renderWithProviders(<DesignSystemPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Design system" })).toBeVisible();
    const contents = screen.getByRole("navigation", { name: "Contents" });
    for (const section of allSections) {
      expect(screen.getByRole("heading", { level: 2, name: section.title })).toBeInTheDocument();
      expect(contents.querySelector(`a[href="#${section.id}"]`)).not.toBeNull();
    }
    expect(screen.getAllByText("Google Sans Flex").length).toBeGreaterThan(0);
    await expectNoA11yViolations();
  });

  it("lists every colour once and puts each in a family", () => {
    const colours = paletteColours();
    expect(new Set(colours.map((c) => c.value.toLowerCase())).size).toBe(colours.length);
    expect(colours.filter((c) => familyOf(c) === "Brand").flatMap((c) => c.tokens)).toContain("primary");
  });

  it("loads the brand font", async () => {
    await document.fonts.ready;
    await document.fonts.load('16px "Google Sans Flex Variable"');
    expect(document.fonts.check('16px "Google Sans Flex Variable"')).toBe(true);
  });

  it("opens the demo dialog from the keyboard", async () => {
    renderWithProviders(<DesignSystemPage />);
    screen.getByRole("button", { name: "Dialog" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(await screen.findByRole("dialog", { name: "Rename flow" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
  });
});
