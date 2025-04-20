import { LoginFormValues, RegisterFormValues } from '@/schemas/auth.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthService from '@/services/auth.service';

// Define query keys as constants for better maintainability
const QUERY_KEYS = {
  APPLICATIONS: ['applications'] as const,
} as const;

export interface AuthError extends Error {
  status?: number;
  message: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: RegisterFormValues) => AuthService.register(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
    },
    onError: (error: unknown) => {
      const apiError = error as AuthError;
      throw {
        status: apiError?.status,
        message: getErrorMessage(apiError),
      };
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: LoginFormValues) => AuthService.login(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: unknown) => {
      const apiError = error as AuthError;
      throw {
        status: apiError?.status,
        message: getErrorMessage(apiError),
      };
    },
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => AuthService.getProfile(),
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    retry: false,
  });
};

// Helper function to get consistent error messages
function getErrorMessage(error: AuthError): string {
  switch (error?.status) {
    case 409:
      return 'Email already exists. Please use a different email.';
    case 422:
      return 'Invalid input. Please check your data and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 401:
      return 'Unauthorized access. Please log in.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again later.';
  }
}
