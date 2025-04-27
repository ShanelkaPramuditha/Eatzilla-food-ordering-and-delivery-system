import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { paymentServiceEnvSchema } from '@app/common/config/env.validation';
import { PaymentConfigService } from './payment-config.service';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: paymentServiceEnvSchema,
      isGlobal: true,
    }),
  ],
  providers: [PaymentConfigService],
  exports: [PaymentConfigService],
})
export class PaymentConfigModule {}
