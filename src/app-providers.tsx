import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { i18n } from "@/lib/i18n";
import { createQueryClient } from "@/lib/query-client";
import { type ThemePreference, ThemeProvider } from "@/lib/theme";

interface AppProvidersProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  /** Injected in tests to turn off retries. */
  queryClient?: QueryClient;
}

export function AppProviders({ children, defaultTheme, queryClient: injected }: AppProvidersProps) {
  const [queryClient] = useState(() => injected ?? createQueryClient());
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider {...(defaultTheme ? { defaultTheme } : {})}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
