import { QueryClientProvider } from "@tanstack/react-query";
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
}

export function AppProviders({ children, defaultTheme }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);
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
