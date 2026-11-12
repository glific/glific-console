import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { ListMessage, LocationRequestMessage, QuickReplyMessage, TemplateMessage } from "./whatsapp-messages";
import { WhatsAppPreview } from "./whatsapp-preview";

describe("WhatsApp preview", () => {
  it("renders templates, quick replies, lists and location requests in a phone frame", async () => {
    renderWithProviders(
      <WhatsAppPreview businessName="Glific">
        <TemplateMessage
          header="Admission open"
          body="Hi *Asha*, admissions close on 30 Nov."
          footer="Reply STOP to opt out"
          buttons={[
            { type: "quick_reply", text: "Apply now" },
            { type: "url", text: "Website", url: "https://glific.org" },
            { type: "phone", text: "Call us", phone: "+911234567890" },
          ]}
          time="10:00"
        />
        <QuickReplyMessage body="Pick a language" options={["English", "हिन्दी"]} />
        <ListMessage
          body="Choose a course"
          sections={[
            { title: "Courses", items: [{ title: "Tailoring", description: "6 weeks" }, { title: "Computers" }] },
          ]}
          expanded
        />
        <LocationRequestMessage body="Share where you are" />
      </WhatsAppPreview>,
    );
    expect(screen.getByRole("figure", { name: "WhatsApp preview" })).toBeVisible();
    expect(screen.getByText("Asha").tagName).toBe("STRONG");
    for (const text of ["Apply now", "Website", "Call us", "हिन्दी", "View options", "Tailoring", "Send location"]) {
      expect(screen.getByText(text)).toBeVisible();
    }
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await expectNoA11yViolations();
  });
});

describe("WhatsApp messages, minimal", () => {
  it("renders a media template and collapsed list without optional parts", () => {
    renderWithProviders(
      <WhatsAppPreview businessName="Glific">
        <TemplateMessage body="Your report" mediaUrl="/img/report.png" />
        <ListMessage body="Pick one" sections={[{ title: "A", items: [{ title: "One" }] }]} />
        <LocationRequestMessage body="Where are you?" time="09:00" />
      </WhatsAppPreview>,
    );
    expect(document.querySelector("img[src='/img/report.png']")).not.toBeNull();
    expect(screen.queryByText("One")).toBeNull();
    expect(screen.getByText("09:00")).toBeVisible();
  });
});
