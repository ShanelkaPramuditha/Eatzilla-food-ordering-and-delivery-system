import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class AlertConfigService {
  constructor(private configService: ConfigService) {}

  get alertServiceHost(): string {
    return this.configService.get<string>('ALERT_SERVICE_HOST')!;
  }

  get alertServicePort(): number {
    return this.configService.get<number>('ALERT_SERVICE_PORT')!;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof AlertEnvironmentVariables>(key: T): AlertEnvironmentVariables[T] {
    return this.configService.get<AlertEnvironmentVariables[T]>(key as string)!;
  }
}
