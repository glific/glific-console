import { screen } from "@testing-library/react";
import { delay, HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderWithProviders } from "@/test/render";
import { ContactsPage } from "./contacts-page";

describe("ContactsPage", () => {
  it("shows a loading state, then the contacts table", async () => {
    worker.use(
      http.get("*/contacts", async () => {
        await delay(100);
        return HttpResponse.json([{ id: "1", name: "Asha Kulkarni", phone: "+919876500001", status: "valid" }]);
      }),
    );
    renderWithProviders(<ContactsPage />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeVisible();
    await expect.element(await screen.findByRole("cell", { name: "Asha Kulkarni" })).toBeVisible();
    expect(screen.getByText("Opted in")).toBeVisible();
    await expectNoA11yViolations();
  });

  it("filters by name or phone and shows a no-results state", async () => {
    renderWithProviders(<ContactsPage />);
    const search = await screen.findByRole("searchbox", { name: "Search contacts" });
    await userEvent.click(search);
    await userEvent.keyboard("meera");
    await expect.poll(() => screen.queryAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Meera Iyer" })).toBeVisible();
    await userEvent.clear(search);
    await userEvent.keyboard("0000000");
    await expect.element(await screen.findByText("No matching contacts")).toBeVisible();
  });

  it("shows the empty state when there are no contacts", async () => {
    worker.use(http.get("*/contacts", () => HttpResponse.json([])));
    renderWithProviders(<ContactsPage />);
    await expect.element(await screen.findByRole("heading", { name: "No contacts yet" })).toBeVisible();
    await expectNoA11yViolations();
  });

  it("shows an error state and recovers on retry", async () => {
    let calls = 0;
    worker.use(
      http.get("*/contacts", () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json({ message: "boom" }, { status: 500 })
          : HttpResponse.json([{ id: "9", name: "Rahul Verma", phone: "+919876500002", status: "invalid" }]);
      }),
    );
    renderWithProviders(<ContactsPage />);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Couldn't load contacts");
    await expectNoA11yViolations();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    await expect.element(await screen.findByRole("cell", { name: "Rahul Verma" })).toBeVisible();
    expect(screen.getByText("Opted out")).toBeVisible();
  });
});
