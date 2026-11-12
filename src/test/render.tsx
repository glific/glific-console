import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { AppProviders } from "@/app-providers";
import { createQueryClient } from "@/lib/query-client";
import { clearSession, setSession } from "@/lib/session";
import { mockSession } from "@/mocks/auth";
import { createRoutes } from "@/routes/router";

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({ queries: { ...queryClient.getDefaultOptions().queries, retry: false } });
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AppProviders queryClient={queryClient}>{children}</AppProviders>
    ),
    ...options,
  });
}

export function renderRoute(
  path: string,
  { internalPages = false, signedIn = true }: { internalPages?: boolean; signedIn?: boolean } = {},
) {
  if (signedIn) setSession(mockSession());
  else clearSession();
  const router = createMemoryRouter(createRoutes({ internalPages }), { initialEntries: [path] });
  return { router, ...renderWithProviders(<RouterProvider router={router} />) };
}
