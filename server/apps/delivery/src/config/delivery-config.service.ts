import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeliveryEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class DeliveryConfigService {
  constructor(private configService: ConfigService) {}

  get deliveryServiceHost(): string {
    return this.configService.get<string>('DELIVERY_SERVICE_HOST')!;
  }

  get deliveryServicePort(): number {
    return this.configService.get<number>('DELIVERY_SERVICE_PORT')!;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof DeliveryEnvironmentVariables>(key: T): DeliveryEnvironmentVariables[T] {
    return this.configService.get<DeliveryEnvironmentVariables[T]>(key as string)!;
  }
}
