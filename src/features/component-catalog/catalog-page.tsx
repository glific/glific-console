import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { sections } from "./sections";

export function CatalogPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-section">
      <PageHeader title={t("catalog.title")} description={t("catalog.description")} />
      <nav aria-label={t("catalog.jumpTo")} className="flex flex-wrap gap-x-stack gap-y-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {section.title}
          </a>
        ))}
      </nav>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="flex flex-col gap-stack"
        >
          <Separator />
          <div className="flex flex-col gap-1">
            <h2 id={`${section.id}-title`} className="text-heading">
              {section.title}
            </h2>
            <p className="text-body text-muted-foreground">{section.description}</p>
          </div>
          {section.content}
        </section>
      ))}
    </div>
  );
}
