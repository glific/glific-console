import { screen, within } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { currentUserWithRoles, glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";
import { dayMood } from "./day-mood";

const section = (name: string) => screen.findByRole("region", { name: new RegExp(`^${name}`) });

describe("Home", () => {
  it("greets the user and shows sample activity, problems and next steps", async () => {
    renderRoute("/");
    // Late at night the greeting is "Working late?", without a name.
    const heading = await screen.findByRole("heading", { level: 1, name: dayMood().withName ? /Glific/ : undefined });
    expect(heading).toBeVisible();

    const stats = await section("How it's going");
    expect(await within(stats).findByText("212")).toBeVisible();
    expect(within(stats).getByText("Messages received")).toBeVisible();
    expect(within(stats).getByText("3,480")).toBeVisible();
    expect(within(stats).getByText("$2.10")).toBeVisible();
    expect(within(stats).getByText(/Sample numbers/)).toBeVisible();

    const fix = await section("Things to fix");
    expect(await within(fix).findByText("Registration flow stopped: the webhook returned an error.")).toBeVisible();

    const next = await section("Suggested actions");
    expect(await within(next).findByText("Worker onboarding")).toBeVisible();
    expect(within(next).getByText("Weekly lesson")).toBeVisible();
    // Links into the current app stay in the rail and the right panel, not on Home.
    expect(within(stats).queryAllByRole("link")).toEqual([]);
    expect(within(fix).queryAllByRole("link")).toEqual([]);
    expect(within(next).queryAllByRole("link")).toEqual([]);
    expect(screen.getByText("1 thing needs your attention.")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("shows staff their chats as the next step", async () => {
    worker.use(currentUserWithRoles(["Staff"]));
    renderRoute("/");
    const next = await section("Suggested actions");
    expect(await within(next).findByText("Reply to your chats")).toBeVisible();
    expect(within(next).queryByText("Worker onboarding")).toBeNull();
  });

  it("asks Glific AI from Home, with pills that fill the box", async () => {
    renderRoute("/");
    await userEvent.click(await screen.findByRole("button", { name: "How many people replied this week?" }));
    const box = screen.getByRole("textbox", { name: "Ask Glific AI" });
    expect(box).toHaveValue("How many people replied this week?");
    await userEvent.click(screen.getAllByRole("button", { name: "Ask" })[0] as HTMLElement);
    const panel = await screen.findByRole("complementary", { name: "Glific AI" });
    expect(await within(panel).findByText("How many people replied this week?")).toBeVisible();
  });

  it("shows a trial its days left and trial suggestions", async () => {
    worker.use(
      glificApi.query("Organization", () =>
        HttpResponse.json({
          data: {
            organization: {
              organization: {
                id: "1",
                name: "Saarthi",
                isTrialOrg: true,
                isSuspended: false,
                trialExpirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 - 60_000).toISOString(),
                bsp: { shortcode: "gupshup" },
              },
            },
          },
        }),
      ),
    );
    renderRoute("/");
    expect(await screen.findByText("3 days left in your trial.")).toBeVisible();
    expect(screen.getByRole("link", { name: /Go live on WhatsApp\s*3 days left/ })).toBeVisible();
    expect(await screen.findByRole("button", { name: "Test my draft" })).toBeVisible();
  });

  it("doesn't call a trial ended when its end date is unknown", async () => {
    worker.use(
      glificApi.query("Organization", () =>
        HttpResponse.json({
          data: {
            organization: {
              organization: {
                id: "1",
                name: "Saarthi",
                isTrialOrg: true,
                isSuspended: false,
                trialExpirationDate: null,
                bsp: { shortcode: "gupshup" },
              },
            },
          },
        }),
      ),
    );
    renderRoute("/");
    expect(await screen.findByRole("link", { name: /Go live on WhatsApp/ })).toBeVisible();
    expect(screen.queryByText(/trial has ended/)).toBeNull();
  });
});

describe("dayMood", () => {
  it("greets by time of day, with Monday, Friday and weekend variations", () => {
    expect(dayMood(new Date(2026, 10, 17, 9))).toMatchObject({ mood: "morning", greeting: "morning" });
    expect(dayMood(new Date(2026, 10, 16, 9)).greeting).toBe("freshWeek");
    expect(dayMood(new Date(2026, 10, 17, 6)).greeting).toBe("earlyStart");
    expect(dayMood(new Date(2026, 10, 20, 14)).greeting).toBe("almostWeekend");
    expect(dayMood(new Date(2026, 10, 21, 14)).greeting).toBe("weekend");
    expect(dayMood(new Date(2026, 10, 17, 18)).mood).toBe("evening");
    expect(dayMood(new Date(2026, 10, 17, 23))).toMatchObject({ mood: "night", withName: false });
  });
});
