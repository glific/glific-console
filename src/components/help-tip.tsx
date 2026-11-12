import { InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/ui/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HelpTipProps {
  children: ReactNode;
  label?: string;
}

export function HelpTip({ children, label }: HelpTipProps) {
  const { t } = useTranslation();
  const name = label ?? t("common.help");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={InfoIcon} label={name} size="xs" tooltip={false} className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent aria-label={name} className="max-w-xs text-body-sm">
        {children}
      </PopoverContent>
    </Popover>
  );
}
