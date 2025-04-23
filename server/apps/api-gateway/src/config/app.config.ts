import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT')!;
  }

  get corsOrigin(): string | string[] {
    const origin = this.configService.get<string>('CORS_ORIGIN')!;
    // If origin contains commas, split it into an array
    return origin.includes(',') ? origin.split(',').map((o) => o.trim()) : origin;
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
