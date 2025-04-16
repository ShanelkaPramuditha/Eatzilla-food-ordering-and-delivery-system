import { useAuth0 } from '@auth0/auth0-react';
import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';

import { USER } from '@/constants';
import { User } from '@/types/user';

const { UserRole } = USER;

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  role: USER.UserRole;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  user: null,
  role: UserRole.GUEST,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<USER.UserRole>(UserRole.GUEST);

  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  useEffect(() => {
    console.log('AuthProvider', isAuthenticated, user);
    const initializeAuth = async () => {
      if (isAuthenticated && user) {
        const userRole = UserRole.ADMIN;
        setRole(userRole);
      } else {
        setRole(UserRole.GUEST);
      }
      setIsLoading(false);
    };

    if (!auth0Loading) {
      initializeAuth();
    }
  }, [isAuthenticated, auth0Loading, user]);

  const login = async () => {
    loginWithRedirect({
      appState: {
        targetUrl: window.location.origin,
      },
    });
  };

  const logout = async () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const value = {
    isAuthenticated,
    role,
    user: user || null,
    isLoading: isLoading || auth0Loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
