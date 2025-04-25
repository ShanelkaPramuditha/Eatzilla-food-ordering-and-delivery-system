import { NestFactory } from '@nestjs/core';
import { DeliveryModule } from './delivery.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(DeliveryModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3005,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  await app.listen();
  const logger = new Logger('DeliveryService');
  logger.log('Delivery service is running and listening on TCP...');
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
