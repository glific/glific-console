import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ContactsPage } from "@/features/contacts";
import { HomePage } from "./home";
import { NotFoundPage } from "./not-found";
import { RootLayout } from "./root-layout";
import { RouteErrorBoundary } from "./route-error";

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "contacts", element: <ContactsPage /> },
          {
            path: "design-system",
            // Lazy: the design system pulls in every component (charts, emoji, calendar) and must not weigh on the app bundle.
            lazy: async () => ({ Component: (await import("@/features/design-system")).DesignSystemPage }),
          },
          { path: "components", element: <Navigate to="/design-system" replace /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);
