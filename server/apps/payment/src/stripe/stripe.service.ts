import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeConfigService } from '../config/stripe.config';

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
@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly stripeConfigService: StripeConfigService) {
    this.stripe = new Stripe(this.stripeConfigService.secret, {
      apiVersion: '2025-03-31.basil',
    });
    this.logger.log('StripeService initialized with API version 2025-03-31.basil');
  }

  async createCheckoutSessionWithPrice(data: CheckoutPayload[]) {
    try {
      console.log('Creating checkout session with price:', data);

      const mappedData = data?.map((item) => ({
        price_data: {
          currency: item.currencyType,
          product_data: {
            name: item.productName,
            description: item.productDescription,
            images: item.productImages?.length ? [item.productImages[0]] : [],
            metadata: {
              product_id: item.productId,
              order_id: item.orderId,
              customer_id: item.customerId,
              customer_name: item.customerName,
              customer_email: item.customerEmail,
            },
          },
          unit_amount: item.unit_amount,
        },
        quantity: item.quantity,
      }));

      console.log('Mapped data for checkout session:', mappedData);

      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: mappedData,
        mode: 'payment',
        return_url: `http://localhost:5173/checkout/pay/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      return {
        client_secret: session.client_secret,
      };
    } catch (error) {
      this.logger.error(`Error creating checkout session with price: ${error}`);
      throw new Error('Unable to create checkout session with price');
    }
  }
}
