import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonEnvironmentVariables } from '@app/common/config/environment.interface';

@Injectable()
export class RestaurantConfigService {
  constructor(private configService: ConfigService) {}

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get mongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME')!;
  }

  // Type-safe access to all environment variables
  get<T extends keyof CommonEnvironmentVariables>(key: T): CommonEnvironmentVariables[T] {
    return this.configService.get<CommonEnvironmentVariables[T]>(key as string)!;
  }
}
