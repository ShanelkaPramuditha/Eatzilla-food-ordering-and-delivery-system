import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/app.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const appConfig = app.get(AppConfigService);

  // Enable CORS with credentials
  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  // Add cookie parser middleware
  app.use(cookieParser());

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable global prefix for all routes
  app.setGlobalPrefix(appConfig.apiPrefix);

  await app.listen(appConfig.port);

  const serverUrl = await app.getUrl();
  const logger = new Logger('ApiGateway');
  logger.log(`API Gateway is running at ${serverUrl}`);
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
