import type { TFunction } from "i18next";
import { z } from "zod/mini";
import { normalisePhone } from "@/lib/auth";

/** Field rules shared by the sign-in and sign-up forms, matching what the backend accepts. */
export function authFields(t: TFunction) {
  return {
    name: z.string().check(z.trim(), z.minLength(1, t("auth.errors.nameRequired"))),
    email: z.email(t("auth.errors.emailInvalid")),
    phone: z
      .pipe(z.string(), z.transform(normalisePhone))
      .check(z.refine((digits) => digits.length >= 10 && digits.length <= 15, t("auth.errors.phoneInvalid"))),
    // The backend's rules for a new password: 10 to 30 characters with each kind of character.
    newPassword: z
      .string()
      .check(
        z.minLength(10, t("auth.errors.passwordShort")),
        z.maxLength(30, t("auth.errors.passwordLong")),
        z.regex(/[a-z]/, t("auth.errors.passwordRules")),
        z.regex(/[A-Z]/, t("auth.errors.passwordRules")),
        z.regex(/[0-9]/, t("auth.errors.passwordRules")),
        z.regex(/[^A-Za-z0-9]/, t("auth.errors.passwordRules")),
      ),
    password: z.string().check(z.minLength(1, t("auth.errors.passwordRequired"))),
    code: z.string().check(z.trim(), z.regex(/^\d{4,8}$/, t("auth.errors.codeInvalid"))),
  };
}
