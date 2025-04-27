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
        ui_mode: 'custom',
        payment_method_types: ['card'],
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: data.deliveryFee,
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
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          orderId: data.orderId,
          customerId: data.customerId,
          orderDate: new Date().toISOString(),
          address: 'temp-address',
          deliveryFee: data.deliveryFee,
        },
      });

      return {
        client_secret: session.client_secret,
      };
    } catch (error) {
      this.logger.error(`Error creating checkout session with price: ${error}`);
      throw new Error('Unable to create checkout session with price');
    }
  }

  async getSessionStatus(sessionId: string) {
    console.log('sessionId', sessionId);
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });

      if (!session) {
        throw new Error('No session found');
      }

      return {
        status: session.status,
        paymentStatus: session.payment_status,
        customerDetails: session.customer_details,
        metadata: session.metadata,
      };
    } catch (error) {
      this.logger.error(`Error retrieving session status: ${error}`);
      throw new Error('Unable to retrieve session status');
    }
  }

  async getReceiptUrl(sessionId: string) {
    try {
      // Retrieve the checkout session
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });

      if (!session || !session.payment_intent) {
        throw new Error('No payment intent found for this session');
      }

      // Get the payment intent ID
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id;

      // Retrieve the payment intent to get charge ID
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
      });

      if (!paymentIntent.latest_charge) {
        throw new Error('No charge found for this payment');
      }

      // Get the charge ID
      const chargeId =
        typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge.id;

      // Get the charge to get receipt URL
      const charge = await this.stripe.charges.retrieve(chargeId);

      return {
        receiptUrl: charge.receipt_url,
        customerId: session.customer,
        amount: session.amount_total,
        currency: session.currency,
        status: session.status,
        paymentStatus: session.payment_status,
        customerDetails: session.customer_details,
        metadata: session.metadata,
        paymentIntent: paymentIntentId,
        charge: chargeId,
      };
    } catch (error) {
      this.logger.error(`Error retrieving receipt URL: ${error}`);
      throw new Error('Unable to retrieve receipt URL');
    }
  }
}
