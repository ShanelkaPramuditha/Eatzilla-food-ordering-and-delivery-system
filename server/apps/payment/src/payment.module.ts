import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv, paymentServiceEnvSchema } from '@app/common/config';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validate: (config) => validateEnv(config, paymentServiceEnvSchema),
    }),
    StripeModule.forRootAsync(),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
