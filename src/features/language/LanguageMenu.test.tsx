import { screen } from "@testing-library/react";
import { HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { setLocale } from "@/lib/i18n";
import { glificApi, languages } from "@/mocks/handlers";
import { worker } from "@/test/msw";
import { renderRoute } from "@/test/render";

function userWithLanguage(locale: string) {
  return glificApi.query("CurrentUser", () =>
    HttpResponse.json({
      data: {
        currentUser: {
          user: {
            id: "1",
            name: "Glific Team",
            accessRoles: [{ label: "Admin" }],
            language: { locale },
            organization: { id: "1", activeLanguages: languages },
          },
        },
      },
    }),
  );
}

afterEach(async () => {
  await setLocale("en");
});

describe("language", () => {
  it("shows the app in the language saved on the user", async () => {
    worker.use(userWithLanguage("hi"));
    renderRoute("/");
    expect(await screen.findByRole("link", { name: "संपर्क" })).toBeVisible();
    expect(document.documentElement.lang).toBe("hi");
  });

  it("saves a new language on the user and switches to it, offering only translated languages", async () => {
    let saved: unknown;
    worker.use(
      userWithLanguage("en"),
      glificApi.mutation("UpdateLanguage", ({ variables }) => {
        saved = variables.input;
        return HttpResponse.json({ data: { updateCurrentUser: { user: { id: "1" }, errors: null } } });
      }),
    );
    renderRoute("/");
    await userEvent.click(await screen.findByRole("button", { name: /account and settings/ }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Language" }));
    expect(await screen.findByRole("menuitemradio", { name: "English" })).toBeChecked();
    expect(screen.queryByRole("menuitemradio", { name: "मराठी" })).toBeNull();
    await userEvent.click(screen.getByRole("menuitemradio", { name: "हिंदी" }));

    expect(await screen.findByRole("link", { name: "संपर्क" })).toBeVisible();
    expect(saved).toEqual({ languageId: "2" });
    expect(await screen.findByText("भाषा बदल दी गई")).toBeVisible();
  });
});
