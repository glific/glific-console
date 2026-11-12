import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { CatalogPage } from "./catalog-page";
import { sections } from "./sections";

describe("CatalogPage", () => {
  it("renders every section with a heading and a jump link", async () => {
    renderWithProviders(<CatalogPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
    for (const section of sections) {
      expect(screen.getByRole("heading", { level: 2, name: section.title })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: section.title })).toHaveAttribute("href", `#${section.id}`);
    }
    await expectNoA11yViolations();
  });

  it("opens the demo dialog from the keyboard", async () => {
    renderWithProviders(<CatalogPage />);
    screen.getByRole("button", { name: "Dialog" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(await screen.findByRole("dialog", { name: "Rename flow" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
  });
});
