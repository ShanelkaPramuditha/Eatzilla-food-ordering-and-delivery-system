import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: '*', // Allow all origins
  });

  // Enable global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(port);

  const serverUrl = await app.getUrl();
  const logger = new Logger('ApiGateway');
  logger.log(`API Gateway is running at ${serverUrl}`);
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
