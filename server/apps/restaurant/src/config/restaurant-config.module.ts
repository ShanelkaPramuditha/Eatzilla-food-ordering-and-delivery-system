import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { restaurantServiceEnvSchema } from '@app/common/config/env.validation';
import { RestaurantConfigService } from './restaurant-config.service';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: restaurantServiceEnvSchema,
      isGlobal: true,
    }),
  ],
  providers: [RestaurantConfigService],
  exports: [RestaurantConfigService],
})
export class RestaurantConfigModule {}
