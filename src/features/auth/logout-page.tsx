import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/spinner";
import { logout } from "@/lib/auth";

export function LogoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    void logout().then(() => navigate("/login", { replace: true }));
  }, [navigate]);
  return (
    <main className="flex min-h-svh items-center justify-center">
      <Spinner label={t("auth.signingOut")} />
    </main>
  );
}
