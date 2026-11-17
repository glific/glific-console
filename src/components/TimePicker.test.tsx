import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { TimePicker } from "./TimePicker";

function Harness() {
  const [value, setValue] = useState("09:30");
  return (
    <>
      <TimePicker value={value} onValueChange={setValue} aria-label="Start time" />
      <output>{value}</output>
    </>
  );
}

describe("TimePicker", () => {
  it("shows and changes a 24-hour time", async () => {
    const { container } = renderWithProviders(<Harness />);
    const input = screen.getByLabelText("Start time");
    expect(input).toHaveValue("09:30");
    await userEvent.fill(input, "18:05");
    await expect.element(screen.getByRole("status")).toHaveTextContent("18:05");
    await expectNoA11yViolations(container);
  });
});
