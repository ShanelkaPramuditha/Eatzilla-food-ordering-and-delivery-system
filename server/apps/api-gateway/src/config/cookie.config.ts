import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfigService {
  constructor(private configService: ConfigService) {}

  get accessTokenConfig() {
    return {
      name: 'access_token',
      maxAge: this.parseExpiration(this.configService.get<string>('COOKIE_ACCESS_EXPIRATION')!),
    };
  }

  get refreshTokenConfig() {
    return {
      name: 'refresh_token',
      maxAge: this.parseExpiration(this.configService.get<string>('COOKIE_REFRESH_EXPIRATION')!),
    };
  }

  get secureOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    } as const;
  }

  private parseExpiration(expiration: string): number {
    // If it's already a number in milliseconds, return as is
    if (/^\d+$/.test(expiration)) {
      return parseInt(expiration, 10);
    }

    // Handle time unit formats like '15m', '1h', '7d'
    const timeUnits: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 15 * 60 * 1000; // Default to 15 minutes if format is invalid
    }

    const [, value, unit] = match;
    return parseInt(value, 10) * timeUnits[unit];
  }
}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, CookieConfigService],
  exports: [CookieConfigService],
})
export class CookieConfigModule {}
