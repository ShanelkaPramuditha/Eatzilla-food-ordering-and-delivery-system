import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
      load: [],
    }),
    ClientsModule.register([
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DELIVERY_SERVICE_HOST || '',
          port: Number(process.env.DELIVERY_SERVICE_PORT) || 3005,
        },
      },
    ]),
  ],
  providers: [DeliveryService],
  controllers: [DeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule {}
