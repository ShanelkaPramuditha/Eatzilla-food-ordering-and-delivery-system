import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Changed from '127.0.0.1' to listen on all interfaces
      port: 3004,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  await app.listen();
  const logger = new Logger('RestaurantService');
  logger.log('Restaurant service is running and listening on TCP...');
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
