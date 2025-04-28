import { useAxios as axios } from '@/hooks/use-axios';
import { CheckoutPayload, IPaymentSession } from '@/types/payment';

class PaymentService {
  async getStripeClientSecret(data: CheckoutPayload) {
    const res = await axios.post(`/payment/checkout`, data);
    return res.data;
  }

  async createTransaction(data: IPaymentSession) {
    const res = await axios.post(`/payment`, data);
    return res.data;
  }

  async getReceiptUrl(sessionId: string) {
    const res = await axios.get(`/payment/receipt/${sessionId}`);
    return res.data;
  }

  async getSessionStatus(sessionId: string) {
    const res = await axios.get(`/payment/session-status/${sessionId}`);
    return res.data;
  }
}

export default new PaymentService();
