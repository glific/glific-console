import { screen } from "@testing-library/react";
import { delay, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { glificApi } from "@/mocks/handlers";
import { expectNoA11yViolations } from "@/test/axe";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

const firstName = () => screen.getAllByRole("row")[1]?.querySelectorAll("td")[0]?.textContent;

describe("ContactsPage", () => {
  it("loads the first page of contacts over GraphQL", async () => {
    renderRoute("/contacts");
    await expect.poll(() => screen.queryAllByRole("row").length).toBe(26);
    expect(screen.getByText("60 results")).toBeVisible();
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    await expectNoA11yViolations();
  });

  it("searches on the server and pages through results", async () => {
    renderRoute("/contacts");
    await expect.poll(() => screen.queryAllByRole("row").length).toBe(26);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await expect.poll(() => screen.queryByText("Page 2 of 3")).not.toBeNull();
    await userEvent.fill(screen.getByRole("searchbox", { name: "Search contacts" }), "meera");
    await expect.poll(() => screen.queryByText("6 results")).not.toBeNull();
    expect(firstName()).toContain("Meera");
    await userEvent.fill(screen.getByRole("searchbox", { name: "Search contacts" }), "nobody");
    expect(await screen.findByRole("heading", { name: "No matching contacts" })).toBeVisible();
  });

  it("shows the empty state when the org has no contacts", async () => {
    worker.use(glificApi.query("Contacts", () => HttpResponse.json({ data: { contacts: [], countContacts: 0 } })));
    renderRoute("/contacts");
    expect(await screen.findByRole("heading", { name: "No contacts yet" })).toBeVisible();
  });

  it("shows a loading table, then an error with retry", async () => {
    let calls = 0;
    worker.use(
      glificApi.query("Contacts", async () => {
        calls += 1;
        if (calls === 1) {
          await delay(150);
          return HttpResponse.json({ errors: [{ message: "Internal error" }] });
        }
        return HttpResponse.json({
          data: {
            contacts: [
              { id: "9", name: "Rahul Verma", maskedPhone: "9198******02", status: "VALID", lastMessageAt: null },
            ],
            countContacts: 1,
          },
        });
      }),
    );
    renderRoute("/contacts");
    await expect.poll(() => document.querySelector("table[aria-busy=true]")).not.toBeNull();
    expect((await screen.findByRole("alert")).textContent).toContain("Couldn't load contacts");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Rahul Verma")).toBeVisible();
  });
});
