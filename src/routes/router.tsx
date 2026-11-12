import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { LoginPage, LogoutPage, RequireAuth } from "@/features/auth";
import { ContactsPage } from "@/features/contacts";
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
    { path: "login", element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
    { path: "logout", element: <LogoutPage /> },
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
    lazy: async () => ({
      Component: (await import("@/features/design-system")).DesignSystemPage,
    }),
  },
  { path: "components", element: <Navigate to="/design-system" replace /> },
];

export const createRouter = () => createBrowserRouter(createRoutes({ internalPages: internalPagesEnabled() }));
