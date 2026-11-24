import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { z } from "zod/mini";
import { FormField, useZodForm } from "@/components/form";
import { Spinner } from "@/components/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AuthError, login, logout } from "@/lib/auth";
import { useSession } from "@/lib/use-session";
import { AuthLayout } from "./AuthLayout";
import { authFields } from "./auth-schemas";
import { canAccess, currentUserKey, everyone, fetchCurrentUser, roleLabels } from "./current-user";

function redirectTarget(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  return from?.startsWith("/") && !from.startsWith("/login") ? from : "/";
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const schema = useMemo(() => {
    const fields = authFields(t);
    return z.object({ phone: fields.phone, password: fields.password });
  }, [t]);
  const form = useZodForm(schema, { phone: "", password: "" });
  // Shown once: cleared from history so a refresh doesn't bring it back.
  const [notice] = useState(() => (location.state as { notice?: string } | null)?.notice);
  useEffect(() => {
    if (notice) navigate(location.pathname, { replace: true, state: null });
  }, [notice, navigate, location.pathname]);

  if (session && !submitting) return <Navigate to={redirectTarget(location.state)} replace />;

  const onSubmit = form.handleSubmit(async ({ phone, password }) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(phone, password);
      // New staff accounts have no role until an admin approves them, as in the current app.
      const user = await queryClient.fetchQuery({ queryKey: currentUserKey, queryFn: fetchCurrentUser });
      if (!canAccess(roleLabels(user), everyone)) {
        // End the session on the server too, not only in this browser.
        await logout();
        queryClient.clear();
        setError(t("auth.errors.notApproved"));
        setSubmitting(false);
        return;
      }
      navigate(redirectTarget(location.state), { replace: true });
    } catch (caught) {
      // The backend's messages (wrong password, suspended account) are written for the user, so show them as-is.
      setError(caught instanceof AuthError && caught.message ? caught.message : t("auth.errors.generic"));
      setSubmitting(false);
    }
  });

  return (
    <AuthLayout
      title={t("auth.title")}
      description={t("auth.description")}
      switcher={
        <>
          {t("auth.newHere")}{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t("auth.createAccount")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          {notice ? (
            <Alert>
              <AlertDescription>{notice}</AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <FormField
            control={form.control}
            name="phone"
            label={t("auth.phone")}
            hint={t("auth.phoneHint")}
            render={({ field, ...control }) => (
              <Input {...field} {...control} type="tel" inputMode="tel" autoComplete="username" />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            label={t("auth.password")}
            render={({ field, ...control }) => (
              <PasswordInput {...field} {...control} autoComplete="current-password" />
            )}
          />
          <Link
            to="/forgot-password"
            className="-mt-2 self-end text-body-sm font-semibold text-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
          <Button type="submit" size="lg" className="rounded-full" disabled={submitting}>
            {submitting ? <Spinner size="sm" label={t("auth.submitting")} className="text-primary-foreground" /> : null}
            {submitting ? t("auth.submitting") : t("auth.submit")}
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
