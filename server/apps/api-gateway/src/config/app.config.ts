import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT')!;
  }

  get corsOrigin(): string | string[] {
    return this.configService.get<string>('CORS_ORIGIN')!;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX')!;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
