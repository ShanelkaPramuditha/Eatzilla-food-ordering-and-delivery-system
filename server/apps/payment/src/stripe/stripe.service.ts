import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentConfigService } from '../config/payment-config.service';
import { CheckoutPayload } from '@app/common/types/payment';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly paymentConfigService: PaymentConfigService) {
    this.stripe = new Stripe(this.paymentConfigService.stripe.secretKey, {
      apiVersion: this.paymentConfigService.stripe.apiVersion,
    });
    this.logger.log('StripeService initialized with API version 2025-03-31.basil');
  }

  async createCheckoutSessionWithPrice(data: CheckoutPayload) {
    try {
      const mappedData = data?.products?.map((item) => ({
        price_data: {
          currency: data.currencyType,
          product_data: {
            name: item.productName,
            description: item.productDescription,
            images: item.productImages?.length ? [item.productImages[0]] : [],
          },
          unit_amount: item.unit_amount,
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: data.shippigFee,
                currency: data.currencyType,
              },
              display_name: 'EatZilla Delivery Service',
              delivery_estimate: {
                maximum: {
                  unit: 'hour',
                  value: 2,
                },
              },
            },
          },
        ],
        line_items: mappedData,
        mode: 'payment',
        return_url: `${this.paymentConfigService.frontendUrl}/checkout/pay/return?session_id={CHECKOUT_SESSION_ID}`,
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
