import { createBrowserRouter, Outlet, type RouteObject } from "react-router";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireGlificAdmin } from "@/features/auth/RequireGlificAdmin";
import { CurrentAppRedirect } from "./CurrentAppRedirect";
import { currentAppPaths } from "./current-app-routes";
import { HomePage } from "./HomePage";
import { NotFoundPage } from "./NotFoundPage";
import { RootLayout } from "./RootLayout";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

export function createRoutes(): RouteObject[] {
  return [
    // Every page is lazy so the first load is only the shell; each route fetches its own chunk.
    {
      path: "login",
      lazy: async () => ({ Component: (await import("@/features/auth/LoginPage")).LoginPage }),
      errorElement: <RouteErrorBoundary />,
    },
    { path: "logout", lazy: async () => ({ Component: (await import("@/features/auth/LogoutPage")).LogoutPage }) },
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
            ...currentAppPaths.map((path) => ({ path: `${path}/*`, element: <CurrentAppRedirect /> })),
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ];
}

export const createRouter = () => createBrowserRouter(createRoutes());
