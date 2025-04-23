import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Changed from '127.0.0.1' to listen on all interfaces
      port: 3001,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  await app.listen();
  const logger = new Logger('PaymentService');
  logger.log('Payment service is running and listening on TCP...');
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
