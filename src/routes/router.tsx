import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ContactsPage } from "@/features/contacts";
import { internalPagesEnabled } from "@/lib/internal-pages";
import { HomePage } from "./home";
import { NotFoundPage } from "./not-found";
import { RootLayout } from "./root-layout";
import { RouteErrorBoundary } from "./route-error";

interface RouteOptions {
  /** Serve the internal /design-system page (Glific team host only, see internalPagesEnabled). */
  internalPages: boolean;
}

export function createRoutes({ internalPages }: RouteOptions): RouteObject[] {
  return [
    {
      element: <RootLayout internalPages={internalPages} />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          errorElement: <RouteErrorBoundary />,
          children: [
            { index: true, element: <HomePage /> },
            { path: "contacts", element: <ContactsPage /> },
            ...(internalPages ? internalRoutes : []),
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ];
}

const internalRoutes: RouteObject[] = [
  {
    path: "design-system",
    // Lazy: the design system pulls in every component (charts, emoji, calendar) and must not weigh on the app bundle.
    lazy: async () => ({ Component: (await import("@/features/design-system")).DesignSystemPage }),
  },
  { path: "components", element: <Navigate to="/design-system" replace /> },
];

export const createRouter = () => createBrowserRouter(createRoutes({ internalPages: internalPagesEnabled() }));
