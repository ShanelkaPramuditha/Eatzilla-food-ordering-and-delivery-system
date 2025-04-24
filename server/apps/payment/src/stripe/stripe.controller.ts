import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Stripe } from 'stripe';
import { MessagePattern } from '@nestjs/microservices';

interface CheckoutPayload {
  priceId?: string;
  quantity?: number;
}

@Controller()
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @MessagePattern({ cmd: 'get.products' })
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripeService.getProducts();
      this.logger.log('Products fetched successfully');
      return products;
    } catch {
      throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'get.customers' })
  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripeService.getCustomers();
      this.logger.log('Customers fetched successfully');
      return customers;
    } catch {
      throw new HttpException('Failed to fetch customers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'post.checkout' })
  async createCheckoutSession(payload: CheckoutPayload) {
    try {
      // if (!payload || !payload.priceId) {
      //   throw new Error('Price ID is required');
      // }

      const session = await this.stripeService.createCheckoutSession(
        'price_1RHJEQCr6SCSfshwaDDfO0Yw',
        1,
      );

      this.logger.log('Checkout session created successfully');
      return session;
    } catch (error) {
      this.logger.error(`Error creating checkout session: ${error}`);
      throw new HttpException(
        'Failed to create checkout session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
