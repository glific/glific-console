import { createBrowserRouter, Navigate, Outlet, type RouteObject } from "react-router";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireGlificAdmin } from "@/features/auth/RequireGlificAdmin";
import { CurrentAppRedirect } from "./CurrentAppRedirect";
import { currentAppPaths, renamedAuthPaths } from "./current-app-routes";
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
    {
      path: "register",
      lazy: async () => ({ Component: (await import("@/features/auth/RegisterPage")).RegisterPage }),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "forgot-password",
      lazy: async () => ({ Component: (await import("@/features/auth/ForgotPasswordPage")).ForgotPasswordPage }),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "trial",
      lazy: async () => ({ Component: (await import("@/features/auth/TrialSignUpPage")).TrialSignUpPage }),
      errorElement: <RouteErrorBoundary />,
    },
    ...Object.entries(renamedAuthPaths).map(([path, to]) => ({ path, element: <Navigate to={to} replace /> })),
    { path: "logout/*", element: <Navigate to="/logout" replace /> },
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
            { index: true, lazy: async () => ({ Component: (await import("@/features/home")).HomePage }) },
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
