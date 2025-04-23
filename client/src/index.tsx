// Import css
import '@/styles/globals.css';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { USER } from '@/constants';
import { queryClient } from '@/lib/query-client';
import { FullScreenLoader } from '@/components/common/loaders';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { User } from './types/user';

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: {
      isAuthenticated: false,
      user: null,
      role: USER.UserRole.GUEST,
      isLoading: true,
      login: async () => {},
      logout: async () => {},
    },
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    auth: {
      isAuthenticated: boolean;
      user: User | null;
      role: USER.UserRole;
      isLoading: boolean;
      login?: (email: string, password: string) => Promise<void>;
      logout?: () => void;
    };
  }
}

function InnerApp() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <FullScreenLoader />;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <ThemeProvider enableSystem={false} attribute='class' defaultTheme='system'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
