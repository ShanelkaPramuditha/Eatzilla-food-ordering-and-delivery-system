import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
      queue: 'payment_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  const logger = new Logger('PaymentService');
  logger.log('Payment service is running and listening for messages...');
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
