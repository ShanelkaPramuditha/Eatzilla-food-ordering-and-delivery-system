import PaymentService from '@/services/payment.service';
import { CheckoutPayload } from '@/types/payment';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetStripeClientSecret = () => {
  return useMutation<unknown, Error, CheckoutPayload>({
    mutationFn: (data) => PaymentService.getStripeClientSecret(data),
  });
};

export const useGetReceiptUrl = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['receipt', sessionId],
    queryFn: () => PaymentService.getReceiptUrl(sessionId as string),
    enabled: !!sessionId,
    retry: 3,
    staleTime: Infinity,
  });
};

export const useGetSessionStatus = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['sessionStatus', sessionId],
    queryFn: () => PaymentService.getSessionStatus(sessionId as string),
    enabled: !!sessionId,
    retry: 3,
    staleTime: Infinity,
  });
};
