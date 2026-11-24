import { lazy, type ReactNode, Suspense } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/glific-logo.png";

// Decorative and hidden on phones, so the form never waits for it.
const BrandPanel = lazy(async () => ({ default: (await import("./BrandPanel")).BrandPanel }));

interface AuthLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  switcher?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, description, switcher, children }: AuthLayoutProps) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-svh bg-background">
      <Suspense fallback={<div aria-hidden="true" className="hidden flex-1 bg-brand-panel lg:block" />}>
        <BrandPanel />
      </Suspense>
      <main className="flex flex-1 flex-col">
        <div className="flex min-h-16 items-center justify-between gap-stack px-7 py-5">
          <img src={logo} alt={t("app.name")} width={38} height={23} className="lg:invisible" />
          {switcher ? <p className="text-body text-muted-foreground">{switcher}</p> : null}
        </div>
        <div className="mx-auto flex w-full max-w-md flex-col gap-section px-6 pt-8 pb-14">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-title">{title}</h1>
            {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
