import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class MicroserviceConfigService {
  constructor(private configService: ConfigService) {}

  get paymentService(): { host: string; port: number } {
    return {
      host: this.configService.get<string>('PAYMENT_SERVICE_HOST')!,
      port: this.configService.get<number>('PAYMENT_SERVICE_PORT')!,
    };
  }

  get<T extends keyof PaymentEnvironmentVariables>(key: T): PaymentEnvironmentVariables[T] {
    return this.configService.get<PaymentEnvironmentVariables[T]>(key as string)!;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [MicroserviceConfigService],
  exports: [MicroserviceConfigService],
})
export class MicroserviceConfigModule {}
