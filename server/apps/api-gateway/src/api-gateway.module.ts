import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './services/payment/payment.module';
import { DatabaseModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { validateEnv, apiGatewayEnvSchema } from '@app/common/config';
import { AppConfigModule } from './config/app.config';
import { OrderModule } from './services/order/order.module';
import { DeliveryModule } from './services/delivery/delivery.module';
import { AlertModule } from './services/alert/alert.module';
import { RestaurantModule } from './services/restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validate: (config) => validateEnv(config, apiGatewayEnvSchema),
    }),
    AppConfigModule,
    DatabaseModule,
    AlertModule,
    PaymentModule,
    AuthModule,
    UsersModule,
    OrderModule,
    DeliveryModule,
    RestaurantModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
