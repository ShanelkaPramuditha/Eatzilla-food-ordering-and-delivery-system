import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeConfigService } from '../config/stripe.config';

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

  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list();
      this.logger.log('Products fetched successfully');
      console.log('products');
      return products.data;
    } catch {
      throw new Error('Unable to fetch products from Stripe');
    }
  }

  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list();
      this.logger.log('Customers fetched successfully');
      return customers.data;
    } catch {
      throw new Error('Unable to fetch customers from Stripe');
    }
  }

  async createCheckoutSession(priceId: string, quantity: number = 1) {
    console.log('Creating checkout session');
    try {
      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
          {
            // Use the provided price ID from the parameter
            price: 'price_1RHJJCCr6SCSfshwjvrM2aRI',
            quantity,
          },
        ],
        mode: 'payment',
        return_url: `http://localhost:5173/pay/return?session_id={CHECKOUT_SESSION_ID}`,
      });
      this.logger.log('Checkout session created successfully');
      return { clientSecret: session.client_secret };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      this.logger.error(`Error creating checkout session: ${error}`);
      throw new Error('Unable to create checkout session');
    }
  }
}
