import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OrderManagementModule } from './order-management.module';
import { RABBITMQ_QUEUES } from './constants';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(OrderManagementModule);
  const configService = app.get(ConfigService);

  // Apply global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Connect as a microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: configService.get<string>('ORDER_QUEUE', RABBITMQ_QUEUES.ORDER),
      queueOptions: {
        durable: true,
      },
    },
  });

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API for managing food delivery orders')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start microservices
  await app.startAllMicroservices();

  // Start HTTP server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Order Management Service is running on port ${port}`);
}

void bootstrap();
