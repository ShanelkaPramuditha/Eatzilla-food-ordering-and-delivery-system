import '@/styles/globals.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './components/ui/button';
import { Loader } from 'lucide-react';

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className='flex w-screen h-screen items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='mt-4'>
        {isAuthenticated && !isLoading ? (
          <>
            <div>
              <img src={user?.picture} alt={user?.name} />
              <h2>User Name: {user?.name}</h2>
              <p>Email: {user?.email}</p>
            </div>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

export default App;

// Login and Logout buttons
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

// Logout button
const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </Button>
  );
};
