export type CheckoutPayload = {
  customerId: string;
  orderId: string;
  paymentType: 'card' | 'cashapp';
  currencyType: string;
  customerEmail: string;
  customerName: string;
  deliveryFee: number;
  products: {
    productId: string;
    productName: string;
    unit_amount: number;
    quantity: number;
    productDescription?: string;
    productImages?: string[];
  }[];
};

export interface IPaymentSession {
  orderId?: string;
  customerId?: string;
  paymentIntentId?: string;
  chargeId?: string;
  sessionId: string;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
  paymentMethod: string;
  receiptUrl?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}
