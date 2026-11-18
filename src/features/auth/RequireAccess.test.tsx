import { screen } from "@testing-library/react";
import { HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { setSession } from "@/lib/session";
import { mockSession } from "@/mocks/auth";
import { glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderWithProviders } from "@/test/render";
import { managers } from "./current-user";
import { RequireAccess } from "./RequireAccess";

function renderAs(roles: string[]) {
  worker.use(
    glificApi.query("CurrentUser", () =>
      HttpResponse.json({
        data: {
          currentUser: {
            user: {
              id: "2",
              name: "Someone",
              accessRoles: roles.map((label) => ({ label })),
              organization: { id: "1" },
            },
          },
        },
      }),
    ),
  );
  setSession(mockSession());
  return renderWithProviders(
    <MemoryRouter>
      <RequireAccess allow={managers}>
        <h1>Flows</h1>
      </RequireAccess>
    </MemoryRouter>,
  );
}

describe("RequireAccess", () => {
  it("shows the page to an allowed role", async () => {
    renderAs(["Manager"]);
    expect(await screen.findByRole("heading", { level: 1, name: "Flows" })).toBeVisible();
  });

  it("shows the permission-denied page to anyone else", async () => {
    const { container } = renderAs(["Staff"]);
    expect(await screen.findByRole("heading", { level: 1, name: "You don't have access to this page" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Flows" })).toBeNull();
    expect(screen.getByRole("link", { name: "Go to home" })).toHaveAttribute("href", "/");
    await expectNoA11yViolations(container);
  });
});
