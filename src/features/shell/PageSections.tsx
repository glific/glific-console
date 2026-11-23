import { useTranslation } from "react-i18next";
import { SectionNav } from "@/components/SectionNav";
import { useNavigation } from "./navigation";

interface PageSectionsProps {
  section: string;
  variant?: "tabs" | "column";
  className?: string;
}

export function PageSections({ section, variant, className }: PageSectionsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const definition = navigation.section(section);
  const resolved = definition ? navigation.resolve(definition) : null;
  // Only pages rebuilt here: links into the current app stay in the rail and the right panel.
  const pages = resolved?.pages.filter((page) => "to" in page.target) ?? [];
  if (!resolved || pages.length < 2) return null;
  return (
    <SectionNav
      label={t("nav.sections", { section: t(resolved.label) })}
      items={pages.map((page) => ({ id: page.id, label: t(page.label), destination: page.target }))}
      variant={variant}
      className={className}
    />
  );
}
