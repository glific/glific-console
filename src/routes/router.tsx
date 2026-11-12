import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { RequireAuth } from "@/features/auth/require-auth";
import { internalPagesEnabled } from "@/lib/internal-pages";
import { HomePage } from "./home";
import { NotFoundPage } from "./not-found";
import { RootLayout } from "./root-layout";
import { RouteErrorBoundary } from "./route-error";

interface RouteOptions {
  internalPages: boolean;
}

export function createRoutes({ internalPages }: RouteOptions): RouteObject[] {
  return [
    // Every page is lazy so the first load is only the shell; each route fetches its own chunk.
    {
      path: "login",
      lazy: async () => ({ Component: (await import("@/features/auth/login-page")).LoginPage }),
      errorElement: <RouteErrorBoundary />,
    },
    { path: "logout", lazy: async () => ({ Component: (await import("@/features/auth/logout-page")).LogoutPage }) },
    {
      element: (
        <RequireAuth>
          <RootLayout internalPages={internalPages} />
        </RequireAuth>
      ),
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          errorElement: <RouteErrorBoundary />,
          children: [
            { index: true, element: <HomePage /> },
            {
              path: "contacts",
              lazy: async () => ({ Component: (await import("@/features/contacts")).ContactsPage }),
            },
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
    lazy: async () => ({
      Component: (await import("@/features/design-system")).DesignSystemPage,
    }),
  },
  { path: "components", element: <Navigate to="/design-system" replace /> },
];

export const createRouter = () => createBrowserRouter(createRoutes({ internalPages: internalPagesEnabled() }));
