import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { USER } from '@/constants';
import { User } from '@/types/user';
import { setAuthToken } from '@/hooks/use-axios';
import { useGetUser, useLogin } from '@/services/tanstack-hooks/auth.hook';

const { UserRole } = USER;

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  role: USER.UserRole;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  user: null,
  role: UserRole.GUEST,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<USER.UserRole>(UserRole.GUEST);

  const { data: userData, isLoading: isUserLoading } = useGetUser();
  const loginMutation = useLogin();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoading) {
      if (userData) {
        setUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
      } else {
        // Only clear user data if there's no token
        if (!localStorage.getItem('token')) {
          setUser(null);
          setRole(UserRole.GUEST);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
  }, [userData, isUserLoading]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setAuthToken(response.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setAuthToken('');
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setAuthToken('');
    setUser(null);
    setRole(UserRole.GUEST);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    role,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
