'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

/**
 * QueryClient configured for Jubir Warga:
 * - 60s stale time supaya tidak refetch agresif (Beranda banyak widget)
 * - 5min gc time
 * - Retry hanya untuk network error (4xx jangan di-retry)
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 menit
        gcTime: 5 * 60 * 1000, // 5 menit
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on 4xx
          if (error instanceof Error && /4\d\d/.test(error.message)) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // SSR: bikin baru tiap request
    return makeQueryClient();
  }
  // Browser: singleton
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
