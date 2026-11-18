import { useTranslation } from "react-i18next";
import logo from "@/assets/glific-logo.png";
import { MessageBubble } from "@/components/chat/MessageBubble";

const proof = ["nonprofits", "messages", "openSource"] as const;

/** The green panel beside the sign-in and sign-up forms, from the 2.0 prototype. */
export function BrandPanel() {
  const { t } = useTranslation();
  return (
    <section
      aria-label={t("auth.panel.label")}
      className="relative hidden flex-1 flex-col overflow-hidden bg-brand-panel px-7 pt-5 pb-10 text-brand-panel-foreground lg:flex"
    >
      <span className="w-fit rounded-md bg-background p-1">
        <img src={logo} alt={t("app.name")} width={38} height={23} />
      </span>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-section">
        <div className="flex flex-col gap-stack">
          <p className="text-display font-bold">
            {t("auth.panel.headline")} <span className="text-brand-highlight">{t("auth.panel.highlight")}</span>
          </p>
          <p className="text-subheading font-normal opacity-75">{t("auth.panel.subline")}</p>
        </div>
        <div aria-hidden="true" className="flex flex-col gap-2 rounded-2xl bg-chat-surface p-stack">
          <MessageBubble direction="inbound" text={t("auth.panel.chat.greeting")} time="10:02" />
          <MessageBubble direction="outbound" text={t("auth.panel.chat.reply")} time="10:02" status="read" />
          <MessageBubble direction="inbound" text={t("auth.panel.chat.lesson")} time="10:03" />
        </div>
        <ul className="flex flex-wrap gap-section border-t border-brand-panel-foreground/20 pt-stack">
          {proof.map((item) => (
            <li key={item} className="flex flex-col">
              <span className="text-heading font-bold text-brand-highlight">{t(`auth.panel.proof.${item}.value`)}</span>
              <span className="text-body-sm opacity-75">{t(`auth.panel.proof.${item}.label`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
