import PaymentService from '@/services/payment.service';
import { CheckoutPayload, IPaymentSession } from '@/types/payment';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetStripeClientSecret = () => {
  return useMutation<unknown, Error, CheckoutPayload>({
    mutationFn: (data) => PaymentService.getStripeClientSecret(data),
  });
};

export const useCreateTransaction = () => {
  return useMutation<unknown, Error, IPaymentSession>({
    mutationFn: (transaction) => PaymentService.createTransaction(transaction),
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
