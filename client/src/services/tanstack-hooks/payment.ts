import PaymentService from '@/services/payment.service';
import { CheckoutPayload } from '@/types/payment';
import { useMutation } from '@tanstack/react-query';

export const useGetStripeClientSecret = () => {
  return useMutation<unknown, Error, CheckoutPayload>({
    mutationFn: (data) => PaymentService.getStripeClientSecret(data),
  });
};
