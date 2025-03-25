import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  root.render(
    <React.StrictMode>
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
        <App />
      </Auth0Provider>
    </React.StrictMode>,
  );
}
