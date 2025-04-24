import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeConfigService } from '../config/stripe.config';

export type CheckoutPayload = {
  currency: string;
  unit_amount: number;
  quantity: number;
  customerEmail: string;
  customerName: string;
  productName: string;
  productDescription?: string;
  productImage?: string;
  productId: string;
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

  async createCheckoutSessionWithPrice(data: CheckoutPayload) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'lkr',
              product_data: {
                description: 'Food Delivery Order',
                name: 'Food Delivery Order',
                images: ['https://picsum.photos/200/300'],
                metadata: {
                  product_id: 'product_123',
                  order_id: 'order_123',
                  customer_id: 'cus_123',
                  customer_name: 'John Doe',
                  customer_email: 'john.doe@example.com',
                },
              },
              unit_amount: 12000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `http://localhost:5173/checkouts/return?session_id={CHECKOUT_SESSION_ID}`,
      });
      this.logger.log('Checkout session with price created successfully');

      return {
        client_secret: session.client_secret,
      };
    } catch (error) {
      console.error('Error creating checkout session with price:', error);
      this.logger.error(`Error creating checkout session with price: ${error}`);
      throw new Error('Unable to create checkout session with price');
    }
  }
}
