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

export interface TransactionResponse {
  success: boolean;
  transaction?: {
    paymentStatus: string;
    orderId?: string;
    customerId?: string;
    paymentIntentId?: string;
    chargeId?: string;
    sessionId: string;
    amount?: number;
    currency?: string;
    paymentMethod: string;
    receiptUrl?: string;
    metadata?: Record<string, any>;
  };
}

export interface OrderUpdateResponse {
  status: string;
}
