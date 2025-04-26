import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { orderServiceEnvSchema } from '@app/common/config/env.validation';
import { OrderConfigService } from './order-config.service';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: orderServiceEnvSchema,
      isGlobal: true,
    }),
  ],
  providers: [OrderConfigService],
  exports: [OrderConfigService],
})
export class OrderConfigModule {}
