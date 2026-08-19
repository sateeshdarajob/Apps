import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import { appTheme } from '@/theme';
import { FilterProvider } from './FilterProvider';
import { RoleProvider } from './RoleProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <RoleProvider>
          <FilterProvider>{children}</FilterProvider>
        </RoleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
