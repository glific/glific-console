import { LanguagesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageSwitch } from "./use-language-switch";

export function LanguageMenu() {
  const { t } = useTranslation();
  const { languages, current, change, isSaving } = useLanguageSwitch();
  if (languages.length < 2) return null;
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger disabled={isSaving}>
        <LanguagesIcon aria-hidden="true" />
        {t("language.label")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={current} onValueChange={(locale) => void change(locale)}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.id} value={language.locale}>
              {language.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
