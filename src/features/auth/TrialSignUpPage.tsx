import { ArrowRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod/mini";
import { FormField, useZodForm } from "@/components/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthError, confirmTrial, startTrial, type TrialSignUp } from "@/lib/auth";
import { browser } from "@/lib/browser";
import { AuthLayout } from "./AuthLayout";
import { authFields } from "./auth-schemas";
import { ResendCode } from "./ResendCode";

const TRIAL_DAYS = 14;

type Account = Omit<TrialSignUp, "organisation">;

/**
 * The 14-day trial from the 2.0 prototype: account details, the organisation's name, then the code emailed to
 * them. A trial organisation is then assigned and they go to its login page.
 */
export function TrialSignUpPage() {
  const { t } = useTranslation();
  const [account, setAccount] = useState<Account | null>(null);
  const [signUp, setSignUp] = useState<TrialSignUp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fields = useMemo(() => authFields(t), [t]);
  const accountForm = useZodForm(
    z.object({ name: fields.name, email: fields.email, phone: fields.phone, password: fields.newPassword }),
    { name: "", email: "", phone: "", password: "" },
  );
  const organisationForm = useZodForm(
    z.object({
      organisation: z.string().check(z.trim(), z.minLength(2, t("auth.trial.organisationRequired")), z.maxLength(40)),
    }),
    { organisation: "" },
  );
  const codeForm = useZodForm(z.object({ code: fields.code }), { code: "" });

  const failed = (caught: unknown, fallback: string) =>
    setError(caught instanceof AuthError && caught.message ? caught.message : fallback);

  const submitOrganisation = organisationForm.handleSubmit(async ({ organisation }) => {
    if (!account) return;
    setError(null);
    const next = { ...account, organisation };
    try {
      await startTrial(next);
      setSignUp(next);
    } catch (caught) {
      failed(caught, t("auth.errors.codeNotSent"));
    }
  });

  const submitCode = codeForm.handleSubmit(async ({ code }) => {
    if (!signUp) return;
    setError(null);
    try {
      // The trial organisation has its own address, so this leaves the app.
      browser.open(await confirmTrial(signUp, code));
    } catch (caught) {
      failed(caught, t("auth.errors.trialFailed"));
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
      <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
    </Alert>
  ) : null;
  const next = (label: string, busy: boolean) => (
    <Button type="submit" size="lg" className="rounded-full" disabled={busy}>
      {label}
      <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
    </Button>
  );

  if (signUp) {
    return (
      <AuthLayout
        title={t("auth.trial.codeTitle")}
        description={t("auth.trial.codeSent", { email: signUp.email })}
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
                await startTrial(signUp).catch((caught: unknown) => failed(caught, t("auth.errors.codeNotSent")));
              }}
            />
            {next(t("auth.trial.verify"), codeForm.formState.isSubmitting)}
          </FieldGroup>
        </form>
      </AuthLayout>
    );
  }

  if (account) {
    return (
      <AuthLayout title={t("auth.trial.organisationTitle")} switcher={switcher}>
        <form onSubmit={submitOrganisation} noValidate>
          <FieldGroup>
            {alert}
            <FormField
              control={organisationForm.control}
              name="organisation"
              label={t("auth.trial.organisation")}
              render={({ field, ...control }) => (
                <Input
                  {...field}
                  {...control}
                  autoComplete="organization"
                  placeholder={t("auth.trial.organisationPlaceholder")}
                  maxLength={40}
                />
              )}
            />
            {next(t("auth.trial.continue"), organisationForm.formState.isSubmitting)}
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setAccount(null)}>
              {t("auth.trial.back")}
            </Button>
          </FieldGroup>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.trial.title")} description={t("auth.trial.description")} switcher={switcher}>
      <form onSubmit={accountForm.handleSubmit((values) => setAccount(values))} noValidate>
        <FieldGroup>
          <FormField
            control={accountForm.control}
            name="name"
            label={t("auth.trial.name")}
            render={({ field, ...control }) => <Input {...field} {...control} autoComplete="name" />}
          />
          <FormField
            control={accountForm.control}
            name="email"
            label={t("auth.trial.email")}
            render={({ field, ...control }) => (
              <Input {...field} {...control} type="email" autoComplete="email" placeholder="you@yourngo.org" />
            )}
          />
          <FormField
            control={accountForm.control}
            name="phone"
            label={t("auth.trial.phone")}
            hint={t("auth.trial.phoneHint")}
            render={({ field, ...control }) => (
              <Input {...field} {...control} type="tel" inputMode="tel" autoComplete="tel" />
            )}
          />
          <FormField
            control={accountForm.control}
            name="password"
            label={t("auth.password")}
            hint={t("auth.passwordRules")}
            render={({ field, ...control }) => <PasswordInput {...field} {...control} autoComplete="new-password" />}
          />
          <p className="text-body-sm text-muted-foreground">{t("auth.trial.terms")}</p>
          {next(t("auth.trial.start", { days: TRIAL_DAYS }), false)}
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
