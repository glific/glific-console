import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { currentUserKey, useCurrentUser } from "@/features/auth/current-user";
import { request } from "@/graphql/client";
import { graphql } from "@/graphql/generated";
import { isLocale, setLocale } from "@/lib/i18n";

const UpdateLanguage = graphql(`
  mutation UpdateLanguage($input: CurrentUserInput!) {
    updateCurrentUser(input: $input) {
      user {
        id
      }
      errors {
        key
        message
      }
    }
  }
`);

export function useLanguageSwitch() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const user = useCurrentUser().data;
  const languages = (user?.organization?.activeLanguages ?? []).flatMap((language) =>
    language?.id && language.localized && isLocale(language.locale)
      ? [{ id: language.id, locale: language.locale, name: language.labelLocale || language.label || language.locale }]
      : [],
  );
  const save = useMutation({
    mutationFn: async (languageId: string) => {
      const result = (await request(UpdateLanguage, { input: { languageId } })).updateCurrentUser;
      if (result?.errors?.length) throw new Error(result.errors[0]?.message ?? "");
    },
  });

  async function change(locale: string) {
    const language = languages.find((option) => option.locale === locale);
    if (!language) return;
    try {
      await save.mutateAsync(language.id);
      await setLocale(language.locale);
      await queryClient.invalidateQueries({ queryKey: currentUserKey });
      // t from this render is still bound to the old language; confirm in the new one.
      toast.success(i18n.t("language.changed"));
    } catch {
      toast.error(t("language.error"));
    }
  }

  return { languages, current: i18n.language, change, isSaving: save.isPending };
}
