import { createBrowserRouter, Outlet, type RouteObject } from "react-router";
import { RequireAuth } from "@/features/auth/require-auth";
import { RequireGlificAdmin } from "@/features/auth/require-glific-admin";
import { HomePage } from "./home";
import { NotFoundPage } from "./not-found";
import { RootLayout } from "./root-layout";
import { RouteErrorBoundary } from "./route-error";

export function createRoutes(): RouteObject[] {
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
          <RootLayout />
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
            {
              path: "design-system",
              element: (
                <RequireGlificAdmin>
                  <Outlet />
                </RequireGlificAdmin>
              ),
              children: [
                {
                  index: true,
                  lazy: async () => ({ Component: (await import("@/features/design-system")).DesignSystemPage }),
                },
              ],
            },
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ];
}

export const createRouter = () => createBrowserRouter(createRoutes());
