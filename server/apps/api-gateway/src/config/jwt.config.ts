import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  get expiresIn(): string | number {
    return this.parseExpiration(this.configService.get<string>('JWT_EXPIRATION')!);
  }

  get refreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET')!;
  }

  get refreshExpiresIn(): string | number {
    return this.parseExpiration(this.configService.get<string>('JWT_REFRESH_EXPIRATION')!);
  }

  get issuer(): string {
    return this.configService.get<string>('JWT_ISSUER')!;
  }

  private parseExpiration(expiration: string): string | number {
    // If it's already a number in seconds, return as is
    if (/^\d+$/.test(expiration)) {
      return parseInt(expiration, 10);
    }

    // Handle time unit formats like '15m', '1h', '7d'
    const timeUnits: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return '15m'; // Default to 15 minutes if format is invalid
    }

    const [, value, unit] = match;
    return parseInt(value, 10) * timeUnits[unit];
  }
}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
