import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/spinner";
import { closeSubscriptions } from "@/graphql/subscriptions";
import { logout } from "@/lib/auth";

export function LogoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    void Promise.all([logout(), closeSubscriptions()]).then(() => {
      // Drop the previous user's data (roles included) before anyone else signs in on this browser.
      queryClient.clear();
      navigate("/login", { replace: true });
    });
  }, [navigate, queryClient]);
  return (
    <main className="flex min-h-svh items-center justify-center">
      <Spinner label={t("auth.signingOut")} />
    </main>
  );
}
