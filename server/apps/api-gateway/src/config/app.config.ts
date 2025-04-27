import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('API_GATEWAY_PORT')!;
  }

  get corsOrigin(): string | string[] {
    const origin = this.configService.get<string>('CORS_ORIGIN')!;
    // If origin contains commas, split it into an array
    return origin.includes(',') ? origin.split(',').map((o) => o.trim()) : origin;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof ApiGatewayEnvironmentVariables>(key: T): ApiGatewayEnvironmentVariables[T] {
    return this.configService.get<ApiGatewayEnvironmentVariables[T]>(key as string)!;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
