import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { apiGatewayEnvSchema } from '@app/common/config/env.validation';
import { AppConfigService } from './app.config';
import { CookieConfigModule } from './cookie.config';
import { JwtConfigModule } from './jwt.config';
import { MicroserviceConfigModule } from './microservice.config';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: apiGatewayEnvSchema,
      isGlobal: true,
    }),
    CookieConfigModule,
    JwtConfigModule,
    MicroserviceConfigModule,
  ],
  exports: [AppConfigService, CookieConfigModule, JwtConfigModule, MicroserviceConfigModule],
})
export class ApiGatewayConfigModule {}
