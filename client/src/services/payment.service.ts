// src/services/payment.service.ts
import { useAxios as axios } from '@/hooks/use-axios';
import type { CardDetailsFormValues } from '@/schemas/checkout.schema';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  cardDetails: CardDetailsFormValues;
  currency?: string;
  idempotencyKey?: string; // For duplicate payment prevention
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  orderStatus?: string; // Reflects status set by backend
  error?: string;
}

const PaymentService = {
  /**
   * Processes payment through backend API
   * (Frontend only initiates - backend handles status updates)
   */
  async processPayment(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Basic client-side validation
      if (!this.validateCardDetails(data.cardDetails)) {
        throw new Error('Invalid card details');
      }

      const payload = {
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency || 'USD',
        paymentMethod: {
          type: 'card',
          card: {
            number: data.cardDetails.cardNumber.replace(/\s/g, ''),
            exp_month: data.cardDetails.expiryDate.split('/')[0],
            exp_year: `20${data.cardDetails.expiryDate.split('/')[1]}`,
            cvc: data.cardDetails.cvv,
            name: data.cardDetails.cardholderName,
          },
        },
        idempotencyKey: data.idempotencyKey || crypto.randomUUID(),
      };

      const response = await axios.post('/api/payments/process', payload);

      return {
        success: true,
        ...response.data, // Includes status updated by backend
      };
    } catch (error: unknown) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Payment processing failed',
      };
    }
  },

  /**
   * Client-side validation only (backend does real validation)
   */
  validateCardDetails(cardDetails: CardDetailsFormValues): boolean {
    return (
      cardDetails.cardNumber?.replace(/\s/g, '').length === 16 &&
      /^\d+$/.test(cardDetails.cardNumber.replace(/\s/g, '')) &&
      cardDetails.cvv?.length >= 3 &&
      cardDetails.cvv?.length <= 4 &&
      /^\d+$/.test(cardDetails.cvv) &&
      !!cardDetails.cardholderName?.trim() &&
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiryDate)
    );
  },

  /**
   * Gets payment status from backend (does NOT modify order)
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/status`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch payment status',
      };
    }
  },
};

export default PaymentService;
