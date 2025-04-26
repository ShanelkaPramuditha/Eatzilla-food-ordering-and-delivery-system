import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class OrderConfigService {
  constructor(private configService: ConfigService) {}

  get orderServiceHost(): string {
    return this.configService.get<string>('ORDER_SERVICE_HOST')!;
  }

  get orderServicePort(): number {
    return this.configService.get<number>('ORDER_SERVICE_PORT')!;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof OrderEnvironmentVariables>(key: T): OrderEnvironmentVariables[T] {
    return this.configService.get<OrderEnvironmentVariables[T]>(key as string)!;
  }
}
