import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentConfigModule } from '../config/payment-config.module';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    PaymentConfigModule,
    StripeModule.forRootAsync(),
    DatabaseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
