import '@/styles/globals.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './components/ui/button';

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const handleLogin = () => {
    loginWithRedirect();
  };
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div>
      <h1>Rsbuild with React</h1>
      {isAuthenticated ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
    </div>
  );
};

export default App;
