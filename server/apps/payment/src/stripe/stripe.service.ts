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
    } catch (error) {
      this.logger.error('Failed to fetch products from Stripe', error.stack);
      throw new Error('Unable to fetch products from Stripe');
    }
  }

  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list();
      this.logger.log('Customers fetched successfully');
      return customers.data;
    } catch (error) {
      this.logger.error('Failed to fetch customers from Stripe', error.stack);
      throw new Error('Unable to fetch customers from Stripe');
    }
  }
}
