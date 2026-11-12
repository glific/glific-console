import { screen } from "@testing-library/react"
import { Bar, BarChart, XAxis } from "recharts"
import { describe, expect, it } from "vitest"
import { expectNoA11yViolations } from "@/test/axe"
import { renderWithProviders } from "@/test/render"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "./chart"

const config = {
  sent: { label: "Sent", color: "var(--chart-1)" },
} satisfies ChartConfig

describe("Chart", () => {
  it("renders a chart with a token colour and legend", async () => {
    const { container } = renderWithProviders(
      <ChartContainer
        config={config}
        className="h-48 w-96"
        role="img"
        aria-label="Messages sent per day"
      >
        <BarChart
          data={[
            { day: "Mon", sent: 12 },
            { day: "Tue", sent: 20 },
          ]}
          accessibilityLayer
        >
          <XAxis dataKey="day" />
          <Bar dataKey="sent" fill="var(--color-sent)" />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>,
    )
    expect(
      screen.getByRole("img", { name: "Messages sent per day" }),
    ).toBeVisible()
    await expect
      .poll(() => container.querySelectorAll(".recharts-bar-rectangle").length)
      .toBe(2)
    expect(screen.getByText("Sent")).toBeVisible()
    await expectNoA11yViolations()
  })
})
