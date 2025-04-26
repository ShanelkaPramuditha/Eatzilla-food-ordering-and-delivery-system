import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentEnvironmentVariables } from '@app/common/config/environment.interface';
import Stripe from 'stripe';

@Injectable()
export class PaymentConfigService {
  constructor(private configService: ConfigService) {}

  get allowedHost(): string {
    return this.configService.get<string>('PAYMENT_SERVICE_ALLOWED_HOST')!;
  }

  get port(): number {
    return this.configService.get<number>('PAYMENT_SERVICE_PORT')!;
  }

  // Stripe-specific configuration getter
  get stripeSecretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY')!;
  }

  // Stripe API version getter
  get stripeApiVersion(): Stripe.StripeConfig['apiVersion'] {
    return this.get('STRIPE_API_VERSION');
  }

  // Enhanced stripe configuration getter that includes all Stripe-related configurations
  get stripe() {
    return {
      secretKey: this.stripeSecretKey,
      apiVersion: this.stripeApiVersion,
    };
  }

  // MongoDB configuration getters
  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof PaymentEnvironmentVariables>(key: T): PaymentEnvironmentVariables[T] {
    return this.configService.get<PaymentEnvironmentVariables[T]>(key as string)!;
  }
}
