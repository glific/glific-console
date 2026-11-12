import axe from "axe-core";
import { expect } from "vitest";

// Defaults to the whole document so portalled dialogs and menus are included.
export async function expectNoA11yViolations(container: Element | Document = document): Promise<void> {
  const results = await axe.run(container, {
    resultTypes: ["violations"],
    rules: {
      // Components are tested in isolation, not inside a full page.
      region: { enabled: false },
      "page-has-heading-one": { enabled: false },
      "landmark-one-main": { enabled: false },
    },
  });
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(" ")).join("\n    ")}`,
  );
  expect(summary, "axe violations").toEqual([]);
}
