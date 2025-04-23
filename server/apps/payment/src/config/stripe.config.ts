import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY')!;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, StripeConfigService],
  exports: [StripeConfigService],
})
export class StripeConfigModule {}
