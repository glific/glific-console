import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod/mini";
import { FormField, useZodForm } from "@/components/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthError, registerStaff, sendOtp } from "@/lib/auth";
import { captchaToken } from "@/lib/recaptcha";
import { AuthLayout } from "./AuthLayout";
import { authFields } from "./auth-schemas";
import { ResendCode } from "./ResendCode";

type Details = { name: string; email: string; phone: string; password: string; consentForUpdates: boolean };

/**
 * A staff member creates an account in their organisation: details, then the code sent on WhatsApp. The account
 * has no access until an admin gives it a role.
 */
export function RegisterPage() {
  const { t } = useTranslation();
  const [details, setDetails] = useState<Details | null>(null);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = useMemo(() => authFields(t), [t]);
  const detailsForm = useZodForm(
    z.object({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      password: fields.newPassword,
      consentForUpdates: z.boolean(),
    }),
    { name: "", email: "", phone: "", password: "", consentForUpdates: true },
  );
  const codeForm = useZodForm(z.object({ code: fields.code }), { code: "" });

  const failed = (caught: unknown, fallback: string) =>
    setError(caught instanceof AuthError && caught.message ? caught.message : fallback);

  const sendCode = async (phone: string) => sendOtp(phone, "register", await captchaToken("register"));

  const submitDetails = detailsForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await sendCode(values.phone);
      setDetails(values);
    } catch (caught) {
      failed(caught, t("auth.errors.codeNotSent"));
    }
  });

  const submitCode = codeForm.handleSubmit(async ({ code }) => {
    if (!details) return;
    setError(null);
    try {
      await registerStaff({ ...details, otp: code });
      setRegistered(true);
    } catch {
      setError(t("auth.errors.registerFailed"));
    }
  });

  const switcher = (
    <>
      {t("auth.haveAccount")}{" "}
      <Link to="/login" className="font-semibold text-primary hover:underline">
        {t("auth.logIn")}
      </Link>
    </>
  );
  const alert = error ? (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : null;

  if (registered) {
    return (
      <AuthLayout title={t("auth.register.doneTitle")} description={t("auth.register.done")}>
        <Button asChild size="lg" className="rounded-full">
          <Link to="/login">{t("auth.logIn")}</Link>
        </Button>
      </AuthLayout>
    );
  }

  if (details) {
    return (
      <AuthLayout
        title={t("auth.register.codeTitle")}
        description={t("auth.register.codeSent", { phone: details.phone })}
        switcher={switcher}
      >
        <form onSubmit={submitCode} noValidate>
          <FieldGroup>
            {alert}
            <FormField
              control={codeForm.control}
              name="code"
              label={t("auth.code.label")}
              render={({ field, ...control }) => (
                <Input {...field} {...control} inputMode="numeric" autoComplete="one-time-code" maxLength={8} />
              )}
            />
            <ResendCode
              onResend={async () => {
                setError(null);
                await sendCode(details.phone).catch((caught: unknown) => failed(caught, t("auth.errors.codeNotSent")));
              }}
            />
            <Button type="submit" size="lg" className="rounded-full" disabled={codeForm.formState.isSubmitting}>
              {t("auth.register.submit")}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setDetails(null)}>
              {t("auth.register.editDetails")}
            </Button>
          </FieldGroup>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.register.title")} description={t("auth.register.description")} switcher={switcher}>
      <form onSubmit={submitDetails} noValidate>
        <FieldGroup>
          {alert}
          <FormField
            control={detailsForm.control}
            name="name"
            label={t("auth.register.name")}
            render={({ field, ...control }) => <Input {...field} {...control} autoComplete="name" />}
          />
          <FormField
            control={detailsForm.control}
            name="email"
            label={t("auth.register.email")}
            render={({ field, ...control }) => <Input {...field} {...control} type="email" autoComplete="email" />}
          />
          <FormField
            control={detailsForm.control}
            name="phone"
            label={t("auth.phone")}
            hint={t("auth.register.phoneHint")}
            render={({ field, ...control }) => (
              <Input {...field} {...control} type="tel" inputMode="tel" autoComplete="tel" />
            )}
          />
          <FormField
            control={detailsForm.control}
            name="password"
            label={t("auth.password")}
            hint={t("auth.passwordRules")}
            render={({ field, ...control }) => <PasswordInput {...field} {...control} autoComplete="new-password" />}
          />
          <Field orientation="horizontal">
            <Checkbox
              id="register-updates"
              checked={detailsForm.watch("consentForUpdates")}
              onCheckedChange={(checked) => detailsForm.setValue("consentForUpdates", checked === true)}
            />
            <FieldLabel htmlFor="register-updates" className="font-normal">
              {t("auth.register.updates")}
            </FieldLabel>
          </Field>
          <Button type="submit" size="lg" className="rounded-full" disabled={detailsForm.formState.isSubmitting}>
            {t("auth.register.sendCode")}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
