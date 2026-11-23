import { createBrowserRouter, Navigate, Outlet, type RouteObject } from "react-router";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireGlificAdmin } from "@/features/auth/RequireGlificAdmin";
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
    // The current app's sign-in addresses, still in old emails and bookmarks once this app takes over.
    { path: "registration", element: <Navigate to="/register" replace /> },
    { path: "confirmotp", element: <Navigate to="/register" replace /> },
    { path: "resetpassword-phone", element: <Navigate to="/forgot-password" replace /> },
    { path: "resetpassword-confirmotp", element: <Navigate to="/forgot-password" replace /> },
    { path: "trial-registration", element: <Navigate to="/trial" replace /> },
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
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ];
}

export const createRouter = () => createBrowserRouter(createRoutes());
