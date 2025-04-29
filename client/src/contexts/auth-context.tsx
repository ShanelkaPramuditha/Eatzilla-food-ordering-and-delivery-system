import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { USER } from '@/constants';
import { User } from '@/types/user';
import { useGetUser, useLogin, useLogout } from '@/services/tanstack-hooks/auth.hook';
import { toast } from 'sonner';
import { useNotifyStore } from '@/store/notify.store';

const { UserRole } = USER;

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  role: USER.UserRole;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  user: null,
  role: UserRole.GUEST,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<USER.UserRole>(UserRole.GUEST);
  const { clearNotifications } = useNotifyStore();

  const { data: userData, isLoading: isUserLoading } = useGetUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isUserLoading) {
      if (userData) {
        setUser(userData);
        setRole(userData.role);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setRole(UserRole.GUEST);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
  }, [userData, isUserLoading]);

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setRole(UserRole.GUEST);
      setIsAuthenticated(false);
      clearNotifications();

      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
      console.error('Logout failed:', error);
    }
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
