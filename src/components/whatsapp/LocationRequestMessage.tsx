import { MapPinIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BubbleAction } from "./BubbleAction";
import { BubbleCard } from "./BubbleCard";
import { BubbleMeta } from "./BubbleMeta";
import { WhatsAppText } from "./WhatsAppText";

export function LocationRequestMessage({ body, time }: { body: string; time?: string }) {
  const { t } = useTranslation();
  return (
    <BubbleCard
      footer={<BubbleAction icon={<MapPinIcon aria-hidden="true" />}>{t("whatsapp.sendLocation")}</BubbleAction>}
    >
      <div className="whitespace-pre-wrap">
        <WhatsAppText>{body}</WhatsAppText>
      </div>
      <BubbleMeta {...(time ? { time } : {})} />
    </BubbleCard>
  );
}
