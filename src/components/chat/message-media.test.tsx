import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { expectNoA11yViolations } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { MessageMedia } from "./message-media";

describe("MessageMedia", () => {
  it("renders each media kind accessibly", async () => {
    renderWithProviders(
      <div className="flex flex-col gap-2 bg-chat-inbound p-2">
        <MessageMedia kind="image" name="Admit card" />
        <MessageMedia kind="video" />
        <MessageMedia kind="audio" detail="0:42" />
        <MessageMedia kind="document" url="/files/report.pdf" name="report.pdf" detail="1.2 MB · PDF" />
        <MessageMedia kind="location" location={{ latitude: 19.07, longitude: 72.87, label: "Dharavi centre" }} />
        <MessageMedia kind="sticker" name="Thumbs up sticker" />
      </div>,
    );
    expect(screen.getByRole("img", { name: "Admit card" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Video" })).toBeVisible();
    expect(screen.getByText("Voice note")).toBeVisible();
    expect(screen.getByRole("link", { name: /report\.pdf/ })).toHaveAttribute("download", "report.pdf");
    expect(screen.getByRole("link", { name: "Dharavi centre" }).getAttribute("href")).toContain("19.07,72.87");
    await userEvent.tab();
    expect(screen.getByRole("link", { name: /report\.pdf/ })).toHaveFocus();
    await expectNoA11yViolations();
  });
});

describe("MessageMedia with URLs", () => {
  it("renders real image, sticker, video and audio elements", () => {
    const { container } = renderWithProviders(
      <>
        <MessageMedia kind="image" url="/img/admit.png" name="Admit card" />
        <MessageMedia kind="sticker" url="/img/sticker.webp" />
        <MessageMedia kind="video" url="/media/intro.mp4" name="Intro video" />
        <MessageMedia kind="audio" url="/media/note.ogg" />
        <MessageMedia kind="location" />
      </>,
    );
    expect(screen.getByRole("img", { name: "Admit card" })).toHaveAttribute("src", "/img/admit.png");
    expect(screen.getByRole("img", { name: "Sticker" }).className).toContain("size-32");
    expect(container.querySelector("video")).toHaveAttribute("aria-label", "Intro video");
    expect(container.querySelector("audio")).toHaveAttribute("aria-label", "Voice note");
    expect(screen.getByText("Location")).toBeInTheDocument();
  });
});
