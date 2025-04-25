export type CheckoutPayload = {
  paymentType: 'card' | 'cashapp';
  currencyType: string;
  unit_amount: number;
  quantity: number;
  orderId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  productName: string;
  productDescription?: string;
  productImages?: string[];
};
