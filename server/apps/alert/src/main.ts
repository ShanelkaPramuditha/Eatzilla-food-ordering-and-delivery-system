import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AlertConfigService } from './config/alert-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AlertConfigService);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.rabbitMQUrl],
      queue: 'alert_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await microservice.listen();
  const logger = new Logger('AlertService');
  logger.log('Alert microservice is listening...');
}
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
});
