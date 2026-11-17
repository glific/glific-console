import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export function HomePage() {
  const { t } = useTranslation();
  return <PageHeader title={t("home.title")} description={t("home.description")} />;
}
