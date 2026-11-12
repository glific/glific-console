import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Spinner } from "@/components/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AuthError, login } from "@/lib/auth";
import { useSession } from "@/lib/use-session";

function redirectTarget(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  return from?.startsWith("/") && !from.startsWith("/login") ? from : "/";
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session && !submitting) return <Navigate to={redirectTarget(location.state)} replace />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phone.trim() || !password) {
      setError(t("auth.errors.required"));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(phone.replace(/[\s+-]/g, ""), password);
      navigate(redirectTarget(location.state), { replace: true });
    } catch (caught) {
      // The backend's messages (wrong password, suspended account) are written for the user, so show them as-is.
      setError(caught instanceof AuthError ? caught.message : t("auth.errors.generic"));
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-shell p-page">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <span className="text-heading text-primary">glific</span>
          <CardTitle>
            <h1 className="text-title">{t("auth.title")}</h1>
          </CardTitle>
          <CardDescription>{t("auth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Field>
                <FieldLabel htmlFor="login-phone">{t("auth.phone")}</FieldLabel>
                <Input
                  id="login-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="username"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-describedby="login-phone-hint"
                  aria-invalid={Boolean(error) || undefined}
                />
                <FieldDescription id="login-phone-hint">{t("auth.phoneHint")}</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="login-password">{t("auth.password")}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(error) || undefined}
                  />
                  <InputGroupAddon align="inline-end">
                    <IconButton
                      icon={showPassword ? EyeOffIcon : EyeIcon}
                      label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                      size="xs"
                      tooltip={false}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((shown) => !shown)}
                    />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" label={t("auth.submitting")} className="text-primary-foreground" />
                ) : null}
                {submitting ? t("auth.submitting") : t("auth.submit")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
