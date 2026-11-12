import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router";
import { internalPagesEnabled } from "@/lib/internal-pages";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", key: "nav.home", end: true },
  { to: "/contacts", key: "nav.contacts", end: false },
] as const;

const internalNavItems = [{ to: "/design-system", key: "nav.designSystem", end: false }] as const;

export function RootLayout({ internalPages = internalPagesEnabled() }: { internalPages?: boolean }) {
  const { t } = useTranslation();
  const items = internalPages ? [...navItems, ...internalNavItems] : navItems;
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        {t("app.skipToContent")}
      </a>
      <header className="flex h-14 items-center justify-between gap-stack border-b px-page">
        <div className="flex items-center gap-section">
          <span className="text-subheading">{t("app.name")}</span>
          <nav aria-label={t("nav.label")} className="flex items-center gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-body text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="flex-1 p-page">
        <Outlet />
      </main>
    </div>
  );
}
