import { Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/common/config';
import { alertServiceEnvSchema } from '@app/common/config/env.validation';
import { AlertConfigService } from './alert-config.service';

@Module({
  imports: [
    CommonConfigModule.forRoot({
      schema: alertServiceEnvSchema,
      isGlobal: true,
    }),
  ],
  providers: [AlertConfigService],
  exports: [AlertConfigService],
})
export class AlertConfigModule {}
