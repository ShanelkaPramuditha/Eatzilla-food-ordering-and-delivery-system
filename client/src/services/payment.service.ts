import { useAxios as axios } from '@/hooks/use-axios';
import { CheckoutPayload } from '@/types/payment';

class PaymentService {
  async getStripeClientSecret(data: CheckoutPayload) {
    const res = await axios.post(`/payment/checkout`, data);
    return res.data;
  }

  async getReceiptUrl(sessionId: string) {
    const res = await axios.get(`/payment/receipt/${sessionId}`);
    return res.data;
  }
}

export default new PaymentService();
