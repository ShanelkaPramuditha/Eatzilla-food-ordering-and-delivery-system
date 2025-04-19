import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  get expiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRATION')!;
  }
}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
