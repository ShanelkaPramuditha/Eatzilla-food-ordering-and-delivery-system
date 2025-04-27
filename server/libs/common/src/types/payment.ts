export type CheckoutPayload = {
  customerId: string;
  orderId: string;
  paymentType: 'card' | 'cashapp';
  currencyType: string;
  customerEmail: string;
  customerName: string;
  shippigFee: number;
  products: {
    productId: string;
    productName: string;
    unit_amount: number;
    quantity: number;
    productDescription?: string;
    productImages?: string[];
  }[];
};
