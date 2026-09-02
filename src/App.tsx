import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/router';
import { useTheme } from '@/lib/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';

export function App() {
  const theme = useTheme((s) => s.theme);
  const isDark = theme === 'dark';
  const initialize = useAuth((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#161618' : '#FFFFFF',
              color: isDark ? '#F5F5F7' : '#0B0B0C',
              border: isDark ? '1px solid #26262A' : '1px solid #ECECEC',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#0EA5E9', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
