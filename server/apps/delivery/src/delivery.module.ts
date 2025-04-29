import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { deliveryServiceEnvSchema, validateEnv } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeliveryPersonAvailability,
  DeliveryPersonAvailabilitySchema,
} from './schemas/delivery-person.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validate: (config) => validateEnv(config, deliveryServiceEnvSchema),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),
    MongooseModule.forFeature([
      { name: DeliveryPersonAvailability.name, schema: DeliveryPersonAvailabilitySchema },
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
