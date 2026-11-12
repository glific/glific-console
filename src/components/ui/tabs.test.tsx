import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("Tabs", () => {
  it.each(["default", "line"] as const)(
    "switches panels with arrow keys (%s variant)",
    async (variant) => {
      renderWithProviders(
        <Tabs defaultValue="flows">
          <TabsList variant={variant} aria-label="Library">
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <TabsContent value="flows">All flows</TabsContent>
          <TabsContent value="templates">All templates</TabsContent>
        </Tabs>,
      )
      expect(screen.getByRole("tablist").dataset.variant).toBe(variant)
      await userEvent.tab()
      expect(screen.getByRole("tab", { name: "Flows" })).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      expect(screen.getByRole("tab", { name: "Templates" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
      await expect
        .element(screen.getByRole("tabpanel"))
        .toHaveTextContent("All templates")
      await expectNoA11yViolations()
    },
  )
})
