import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod/mini";
import { FormField, useZodForm } from "@/components/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthError, resetPassword, sendOtp } from "@/lib/auth";
import { AuthLayout } from "./AuthLayout";
import { authFields } from "./auth-schemas";
import { ResendCode } from "./ResendCode";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fields = useMemo(() => authFields(t), [t]);
  const phoneForm = useZodForm(z.object({ phone: fields.phone }), { phone: "" });
  const resetForm = useZodForm(z.object({ code: fields.code, password: fields.newPassword }), {
    code: "",
    password: "",
  });

  const failed = (caught: unknown, fallback: string) =>
    setError(caught instanceof AuthError && caught.message ? caught.message : fallback);

  const requestCode = phoneForm.handleSubmit(async (values) => {
    setError(null);
    try {
      await sendOtp(values.phone, "reset");
      setPhone(values.phone);
    } catch (caught) {
      failed(caught, t("auth.errors.codeNotSent"));
    }
  });

  const reset = resetForm.handleSubmit(async ({ code, password }) => {
    if (!phone) return;
    setError(null);
    try {
      await resetPassword(phone, code, password);
      navigate("/login", { replace: true, state: { notice: t("auth.reset.done") } });
    } catch {
      // The backend answers every failure the same way; a wrong or expired code is by far the likeliest.
      setError(t("auth.errors.resetFailed"));
    }
  });

  const backToLogin = (
    <Link to="/login" className="font-semibold text-primary hover:underline">
      {t("auth.backToLogin")}
    </Link>
  );
  const alert = error ? (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : null;

  if (!phone) {
    return (
      <AuthLayout title={t("auth.reset.title")} description={t("auth.reset.description")} switcher={backToLogin}>
        <form onSubmit={requestCode} noValidate>
          <FieldGroup>
            {alert}
            <FormField
              control={phoneForm.control}
              name="phone"
              label={t("auth.phone")}
              hint={t("auth.phoneHint")}
              render={({ field, ...control }) => (
                <Input {...field} {...control} type="tel" inputMode="tel" autoComplete="username" />
              )}
            />
            <Button type="submit" size="lg" className="rounded-full" disabled={phoneForm.formState.isSubmitting}>
              {t("auth.reset.sendCode")}
            </Button>
          </FieldGroup>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.reset.title")} description={t("auth.reset.codeSent", { phone })} switcher={backToLogin}>
      <form onSubmit={reset} noValidate>
        <FieldGroup>
          {alert}
          <FormField
            control={resetForm.control}
            name="code"
            label={t("auth.code.label")}
            render={({ field, ...control }) => (
              <Input {...field} {...control} inputMode="numeric" autoComplete="one-time-code" maxLength={8} />
            )}
          />
          <ResendCode
            onResend={async () => {
              setError(null);
              await sendOtp(phone, "reset").catch((caught: unknown) => failed(caught, t("auth.errors.codeNotSent")));
            }}
          />
          <FormField
            control={resetForm.control}
            name="password"
            label={t("auth.reset.newPassword")}
            hint={t("auth.passwordRules")}
            render={({ field, ...control }) => <PasswordInput {...field} {...control} autoComplete="new-password" />}
          />
          <Button type="submit" size="lg" className="rounded-full" disabled={resetForm.formState.isSubmitting}>
            {t("auth.reset.save")}
          </Button>
          <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setPhone(null)}>
            {t("auth.reset.changeNumber")}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
