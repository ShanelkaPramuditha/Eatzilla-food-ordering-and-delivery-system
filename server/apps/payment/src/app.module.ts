import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { PaymentConfigModule } from './config/payment-config.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PaymentConfigModule, StripeModule.forRootAsync(), PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
