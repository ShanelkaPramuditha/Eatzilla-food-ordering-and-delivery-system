import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PaymentConfigModule } from '../config/payment-config.module';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController],
      imports: [PaymentConfigModule],
      providers: [StripeService],
      exports: [StripeService],
    };
  }
}
