import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { allSections, sectionGroups } from "./all-sections";

export function DesignSystemPage() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-section">
      <nav
        aria-label={t("designSystem.contents")}
        className="sticky top-6 hidden max-h-svh w-48 shrink-0 flex-col gap-stack self-start overflow-y-auto lg:flex"
      >
        {sectionGroups.map(({ group, sections }) => (
          <div key={group} className="flex flex-col gap-1">
            <span className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">{group}</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-md px-2 py-1 text-body-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {section.title}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col gap-section">
        <PageHeader title={t("designSystem.title")} description={t("designSystem.description")} />
        {allSections.map((section, index) => {
          const firstOfGroup = index === 0 || allSections[index - 1]?.group !== section.group;
          return (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="flex scroll-mt-6 flex-col gap-stack"
            >
              {firstOfGroup ? (
                <p className="mt-section text-caption font-semibold tracking-wide text-primary uppercase">
                  {section.group}
                </p>
              ) : (
                <Separator />
              )}
              <div className="flex flex-col gap-1">
                <h2 id={`${section.id}-title`} className="text-heading">
                  {section.title}
                </h2>
                <p className="max-w-3xl text-body text-muted-foreground">{section.description}</p>
              </div>
              {section.content}
            </section>
          );
        })}
      </div>
    </div>
  );
}
