import { InfoIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { ContactAvatar } from "./contact-avatar";
import { SessionWindow } from "./session-window";

interface ChatHeaderProps {
  name: string;
  phone: string;
  group?: string;
  hoursLeft?: number | null;
  onInfo?: () => void;
  onClose?: () => void;
  actions?: ReactNode;
}

export function ChatHeader({ name, phone, group, hoursLeft, onInfo, onClose, actions }: ChatHeaderProps) {
  const { t } = useTranslation();
  return (
    <header data-slot="chat-header" className="flex items-center gap-3 border-b bg-background px-5 py-3">
      <ContactAvatar name={name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-inline">
          <h2 className="truncate text-body font-semibold">{name}</h2>
          {group ? <Badge variant="neutral">{group}</Badge> : null}
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-body-sm text-muted-foreground">
          <span className="shrink-0">{phone}</span>
          <span aria-hidden="true">·</span>
          <SessionWindow hoursLeft={hoursLeft} className="truncate" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {onInfo ? <IconButton icon={InfoIcon} label={t("chat.contactInfo")} onClick={onInfo} /> : null}
        {actions}
        {onClose ? <IconButton icon={XIcon} label={t("chat.close")} onClick={onClose} /> : null}
      </div>
    </header>
  );
}
