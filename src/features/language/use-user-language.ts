import { useEffect } from "react";
import { useCurrentUser } from "@/features/auth/current-user";
import { isLocale, setLocale } from "@/lib/i18n";

/** Shows the app in the language saved on the user, as the current app does. */
export function useUserLanguage() {
  const locale = useCurrentUser().data?.language?.locale;
  useEffect(() => {
    if (isLocale(locale)) void setLocale(locale);
  }, [locale]);
}
