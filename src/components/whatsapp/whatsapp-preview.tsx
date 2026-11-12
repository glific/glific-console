import { ChevronLeftIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ContactAvatar } from "@/components/chat/contact-avatar";
import { cn } from "@/lib/utils";

interface WhatsAppPreviewProps {
  businessName: string;
  children: ReactNode;
  className?: string;
}

/** A phone-sized WhatsApp chat for previewing templates, interactive messages and flows (live app Simulator, prototype TestPhone). */
export function WhatsAppPreview({ businessName, children, className }: WhatsAppPreviewProps) {
  const { t } = useTranslation();
  return (
    <figure
      aria-label={t("whatsapp.preview")}
      data-slot="whatsapp-preview"
      className={cn(
        "flex h-128 w-80 flex-col overflow-hidden rounded-4xl border-8 border-foreground bg-chat-surface",
        className,
      )}
    >
      <div className="flex items-center gap-inline bg-primary px-3 py-2 text-primary-foreground">
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
        <ContactAvatar name={businessName} size="sm" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-semibold">{businessName}</span>
          <span className="text-caption opacity-80">{t("whatsapp.businessAccount")}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">{children}</div>
    </figure>
  );
}
