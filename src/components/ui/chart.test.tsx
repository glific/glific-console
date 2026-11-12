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
  ChartTooltipContent,
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

const payload = [
  {
    dataKey: "sent",
    name: "sent",
    value: 12,
    color: "var(--chart-1)",
    payload: { day: "Mon", sent: 12, read: 7 },
  },
  {
    dataKey: "read",
    name: "read",
    value: 7,
    color: "var(--chart-2)",
    payload: { day: "Mon", sent: 12, read: 7 },
  },
] as unknown as NonNullable<
  Parameters<typeof ChartTooltipContent>[0]["payload"]
>
const fullConfig = {
  sent: {
    label: "Sent",
    color: "var(--chart-1)",
    icon: () => <svg data-testid="sent-icon" />,
  },
  read: {
    label: "Read",
    theme: { light: "var(--chart-2)", dark: "var(--chart-2)" },
  },
} satisfies ChartConfig

describe("ChartTooltipContent and ChartLegendContent", () => {
  it.each(["dot", "line", "dashed"] as const)(
    "renders the %s indicator with labels and values",
    (indicator) => {
      renderWithProviders(
        <ChartContainer config={fullConfig} className="h-48 w-96">
          <ChartTooltipContent
            active
            payload={payload}
            label="Mon"
            indicator={indicator}
          />
        </ChartContainer>,
      )
      expect(screen.getAllByText("Mon").length).toBeGreaterThan(0)
      expect(screen.getByText("Read")).toBeVisible()
      expect(screen.getByText("12")).toBeVisible()
      expect(screen.getByTestId("sent-icon")).toBeInTheDocument()
    },
  )

  it("supports custom formatters, hidden labels and label keys", () => {
    const { rerender } = renderWithProviders(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartTooltipContent
          active
          payload={payload}
          label="Mon"
          labelFormatter={(value) => `Day: ${value}`}
          formatter={(value, name) => <span>{`${name}=${value}`}</span>}
        />
      </ChartContainer>,
    )
    expect(screen.getByText("Day: Mon")).toBeVisible()
    expect(screen.getByText("sent=12")).toBeVisible()
    rerender(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartTooltipContent
          active
          payload={payload}
          hideLabel
          hideIndicator
          labelKey="sent"
          nameKey="dataKey"
        />
      </ChartContainer>,
    )
    expect(screen.queryByText("Day: Mon")).toBeNull()
    rerender(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartTooltipContent active={false} payload={payload} />
      </ChartContainer>,
    )
    expect(screen.queryByText("Read")).toBeNull()
  })

  it("renders a legend with icons and colours, top or bottom", () => {
    const legendPayload = payload.map((p) => ({
      value: String(p.name),
      dataKey: String(p.dataKey),
      color: p.color,
      type: "square" as const,
    }))
    const { rerender } = renderWithProviders(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartLegendContent payload={legendPayload} verticalAlign="top" />
      </ChartContainer>,
    )
    expect(screen.getByText("Sent")).toBeVisible()
    expect(screen.getByTestId("sent-icon")).toBeInTheDocument()
    rerender(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartLegendContent
          payload={legendPayload}
          hideIcon
          nameKey="dataKey"
        />
      </ChartContainer>,
    )
    expect(screen.queryByTestId("sent-icon")).toBeNull()
    rerender(
      <ChartContainer config={fullConfig} className="h-48 w-96">
        <ChartLegendContent payload={[]} />
      </ChartContainer>,
    )
  })
})
