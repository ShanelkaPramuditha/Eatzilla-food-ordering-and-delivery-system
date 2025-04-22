import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthService from '@/services/auth.service';
import { User } from '@/types/user';
import { useAuthStore } from '@/store/auth.store';

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
} as const;

export interface AuthError extends Error {
  status?: number;
  message: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setHasToken = useAuthStore((state) => state.setHasToken);

  return useMutation<AuthResponse, AuthError, RegisterFormValues>({
    mutationFn: (formData) => AuthService.register(formData),
    onSuccess: () => {
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      setHasToken(false);
      throw {
        status: error?.status,
        message: getErrorMessage(error),
      };
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setHasToken = useAuthStore((state) => state.setHasToken);

  return useMutation<AuthResponse, AuthError, LoginFormValues>({
    mutationFn: (formData) => AuthService.login(formData),
    onSuccess: () => {
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      setHasToken(false);
      throw {
        status: error?.status,
        message: getErrorMessage(error),
      };
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setHasToken = useAuthStore((state) => state.setHasToken);

  return useMutation<void, AuthError, void>({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setHasToken(false);
      queryClient.clear();
    },
    onError: (error) => {
      setHasToken(false);
      throw {
        status: error?.status,
        message: getErrorMessage(error),
      };
    },
  });
};

export const useGetUser = () => {
  const hasToken = useAuthStore((state) => state.hasToken);
  const setHasToken = useAuthStore((state) => state.setHasToken);

  return useQuery<User, AuthError>({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        return await AuthService.getProfile();
      } catch (error) {
        if (error && typeof error === 'object' && 'status' in error) {
          const apiError = error as { status?: number };
          if (apiError.status === 401) {
            setHasToken(false);
            throw { status: 401, message: 'Unauthorized' } as AuthError;
          }
        }
        throw { message: 'An unexpected error occurred' } as AuthError;
      }
    },
    enabled: hasToken,
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        setHasToken(false);
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

function getErrorMessage(error: AuthError): string {
  if (error.message) {
    return error.message;
  }

  switch (error.status) {
    case 401:
      return 'Invalid email or password';
    case 403:
      return 'You do not have permission to access this resource';
    case 404:
      return 'Resource not found';
    default:
      return 'An unexpected error occurred';
  }
}
