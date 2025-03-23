import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(process.env.PORT ?? 3000);
  // Console log the server URL
  const serverUrl = await app.getUrl();
  console.log(`API Gateway is running at: ${serverUrl}`);
}
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
