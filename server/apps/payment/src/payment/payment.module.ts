import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentConfigModule } from '../config/payment-config.module';

@Module({
  imports: [PaymentConfigModule, StripeModule.forRootAsync()],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
