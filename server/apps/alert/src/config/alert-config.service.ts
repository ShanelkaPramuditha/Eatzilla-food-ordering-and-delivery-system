import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class AlertConfigService {
  constructor(private configService: ConfigService) {}

  get rabbitMQUrl(): string {
    return this.configService.get<string>('ALERT_SERVICE_RABBITMQ_URL')!;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  get resendApiKey(): string | undefined {
    return this.configService.get<string>('RESEND_API_KEY');
  }

  get emailFrom(): string {
    return this.configService.get<string>('EMAIL_FROM') || 'noreply@eatzilla.com';
  }

  // Type-safe access to all environment variables
  get<T extends keyof AlertEnvironmentVariables>(key: T): AlertEnvironmentVariables[T] {
    return this.configService.get<AlertEnvironmentVariables[T]>(key as string)!;
  }
}
