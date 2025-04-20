import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { JwtConfigService } from '../config/jwt.config';
import { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from './decorator/public.decorator';
import { JwtPayload } from '../types/auth';
import { AuthService } from './auth.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private jwtConfig: JwtConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const accessToken = this.extractTokenFromHeader(request);
    const refreshToken = request.headers['x-refresh-token'] as string;

    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret: this.jwtConfig.secret,
        algorithms: ['HS256'],
        issuer: this.jwtConfig.issuer,
        ignoreExpiration: false,
      });
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        if (refreshToken) {
          try {
            const tokens = await this.authService.refreshToken(refreshToken);
            const response = context.switchToHttp().getResponse<Response>();

            response.setHeader('Authorization', `Bearer ${tokens.access_token}`);
            response.setHeader('X-Refresh-Token', tokens.refresh_token);

            const payload = await this.jwtService.verifyAsync<JwtPayload>(tokens.access_token, {
              secret: this.jwtConfig.secret,
              algorithms: ['HS256'],
              issuer: this.jwtConfig.issuer,
              ignoreExpiration: false,
            });
            request.user = payload;
            return true;
          } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
          }
        }
        throw new UnauthorizedException('Access token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid access token format or signature');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
