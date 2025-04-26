import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { deliveryServiceEnvSchema } from '@app/common/config/env.validation';
import { DeliveryConfigService } from './delivery-config.service';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: deliveryServiceEnvSchema,
      isGlobal: true,
    }),
  ],
  providers: [DeliveryConfigService],
  exports: [DeliveryConfigService],
})
export class DeliveryConfigModule {}
