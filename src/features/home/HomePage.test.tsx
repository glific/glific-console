import { screen, within } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { currentUserWithRoles, glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";
import { dayMood } from "./day-mood";
import { periodDays } from "./home-data";

const section = (name: string) => screen.findByRole("region", { name: new RegExp(`^${name}`) });

describe("Home", () => {
  it("greets the user and shows activity, problems and next steps from the backend", async () => {
    renderRoute("/");
    expect(await screen.findByRole("heading", { level: 1, name: /Glific/ })).toBeVisible();

    const stats = await section("How it's going");
    expect(await within(stats).findByText("212")).toBeVisible();
    expect(within(stats).getByText("Messages received")).toBeVisible();
    expect(within(stats).getByText("3,480")).toBeVisible();
    expect(within(stats).getByText("$2.10")).toBeVisible();
    expect(within(stats).getByRole("link", { name: "Open Data analytics" })).toHaveAttribute(
      "href",
      "https://current.glific.test/analytics",
    );

    const fix = await section("Things to fix");
    expect(await within(fix).findByText("Registration flow stopped: the webhook returned an error.")).toBeVisible();
    expect(within(fix).getByRole("link", { name: "All problems" })).toHaveAttribute(
      "href",
      "https://current.glific.test/notifications",
    );

    const next = await section("Suggested actions");
    expect(await within(next).findByText("Worker onboarding")).toBeVisible();
    expect(within(next).queryByText("State registration")).toBeNull();
    const links = within(next).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://current.glific.test/flow/configure/0b1f2c3d-0000-4000-8000-000000000011",
      "https://current.glific.test/trigger/5/edit",
    ]);
    expect(screen.getByText("1 thing needs your attention.")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("shows staff the numbers the backend lets them see, and their chats", async () => {
    worker.use(currentUserWithRoles(["Staff"]));
    renderRoute("/");
    const stats = await section("How it's going");
    expect(await within(stats).findByText("4,380")).toBeVisible();
    expect(within(stats).queryByText("Spent")).toBeNull();
    const next = await section("Suggested actions");
    expect(await within(next).findByRole("link", { name: "Open chats" })).toHaveAttribute(
      "href",
      "https://current.glific.test/chat",
    );
    expect(within(await section("Things to fix")).queryByRole("link", { name: "All problems" })).toBeNull();
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

  it("starts a trial with no flows on building the first one", async () => {
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
      glificApi.query("HomeFlowsAndTriggers", () => HttpResponse.json({ data: { flows: [], triggers: [] } })),
    );
    renderRoute("/");
    expect(await screen.findByText("Let's build your first flow.")).toBeVisible();
    expect(screen.getByRole("link", { name: /Go live on WhatsApp\s*3 days left/ })).toBeVisible();
    const next = await section("Suggested actions");
    expect(await within(next).findByRole("link", { name: "Start" })).toHaveAttribute(
      "href",
      "https://current.glific.test/flow/add",
    );
    expect(screen.getByRole("button", { name: "Build a sign-up flow" })).toBeVisible();
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

describe("periodDays", () => {
  it("splits whole days into this period and the one before, without sharing a day", () => {
    const now = Date.UTC(2026, 10, 23, 12);
    expect(periodDays(7, now)).toEqual({
      current: { fromDate: "2026-11-17", toDate: "2026-11-23" },
      previous: { fromDate: "2026-11-10", toDate: "2026-11-16" },
    });
  });
});
