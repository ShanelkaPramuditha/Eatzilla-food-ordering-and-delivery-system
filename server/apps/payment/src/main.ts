import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { PaymentConfigService } from './config/payment-config.service';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(PaymentConfigService);
  const port = configService.port;

  // Create the microservice with the port from config
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentModule, {
    transport: Transport.TCP,
    options: {
      host: configService.allowedHost,
      port,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  await microservice.listen();

  const logger = new Logger('PaymentService');
  logger.log(`Payment service is running and listening on TCP port ${port}...`);
}

bootstrap().catch((err) => console.error('Bootstrap failed:', err));
