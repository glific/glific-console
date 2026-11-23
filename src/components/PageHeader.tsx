import { type ComponentProps, Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { type NavLinkTarget, NavTargetLink } from "@/components/NavTargetLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  destination: NavLinkTarget;
}

interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** The pages above this one, outermost first; the title is the current page. */
  breadcrumbs?: readonly Crumb[];
  sections?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  sections,
  className,
  ...props
}: PageHeaderProps) {
  const { t } = useTranslation();
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-stack", className)} {...props}>
      <div className="flex flex-wrap items-start justify-between gap-stack">
        <div className="flex min-w-0 flex-col gap-1">
          {breadcrumbs?.length ? (
            <Breadcrumb aria-label={t("breadcrumb.label")}>
              <BreadcrumbList>
                {breadcrumbs.map((crumb) => (
                  <Fragment key={crumb.label}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <NavTargetLink destination={crumb.destination}>{crumb.label}</NavTargetLink>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          ) : null}
          <h1 className="text-title">{title}</h1>
          {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-inline">{actions}</div> : null}
      </div>
      {sections}
    </header>
  );
}
