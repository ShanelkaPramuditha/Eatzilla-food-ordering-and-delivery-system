// Import css
import '@/styles/globals.css';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { USER } from '@/constants';
import { FullScreenLoader } from '@/components/common/loaders';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

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
      login: () => {},
      logout: () => {},
    },
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
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
    <Auth0Provider
      domain={import.meta.env.PUBLIC_AUTH0_DOMAIN}
      clientId={import.meta.env.PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: import.meta.env.PUBLIC_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
      }}
      cacheLocation='localstorage'
      useRefreshTokens={true}
    >
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </Auth0Provider>
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
