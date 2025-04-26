import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class MicroserviceConfigService {
  constructor(private configService: ConfigService) {}

  get paymentService(): { host: string; port: number } {
    return {
      host: this.configService.get<string>('PAYMENT_SERVICE_HOST')!,
      port: this.configService.get<number>('PAYMENT_SERVICE_PORT')!,
    };
  }

  get alertService(): { url: string } {
    return {
      url: this.configService.get<string>('ALERT_SERVICE_RABBITMQ_URL')!,
    };
  }
}

@Module({
  imports: [ConfigModule],
  providers: [MicroserviceConfigService],
  exports: [MicroserviceConfigService],
})
export class MicroserviceConfigModule {}
