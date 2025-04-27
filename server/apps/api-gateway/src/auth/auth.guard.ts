import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { JwtConfigService } from '../config/jwt.config';
import { Response } from 'express';
import { IS_PUBLIC_KEY } from './decorator/public.decorator';
import { ROLES_KEY } from './decorator/roles.decorator';
import { JwtPayload, UserRequest } from '../types/auth';
import { AuthService } from './auth.service';
import { UserRole } from '@app/common/types/user';

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

    const request = context.switchToHttp().getRequest<UserRequest>();
    const accessToken = request.cookies['access_token'];

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

      // Add the user to the request
      request.user = payload;

      // Check for role requirements
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      // If no roles are specified, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role) => payload.role === (role as string));

      if (!hasRequiredRole) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof TokenExpiredError) {
        const refreshToken = request.cookies['refresh_token'];
        if (refreshToken) {
          try {
            const tokens = await this.authService.refreshToken(refreshToken);
            const response = context.switchToHttp().getResponse<Response>();

            response.cookie('access_token', tokens.access_token, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 15 * 60 * 1000,
            });

            response.cookie('refresh_token', tokens.refresh_token, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const payload = await this.jwtService.verifyAsync<JwtPayload>(tokens.access_token, {
              secret: this.jwtConfig.secret,
              algorithms: ['HS256'],
              issuer: this.jwtConfig.issuer,
              ignoreExpiration: false,
            });
            request.user = payload;

            // Check for role requirements after refreshing token
            const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
              context.getHandler(),
              context.getClass(),
            ]);

            if (!requiredRoles || requiredRoles.length === 0) {
              return true;
            }

            const hasRequiredRole = requiredRoles.some((role) => payload.role === (role as string));

            if (!hasRequiredRole) {
              throw new ForbiddenException('You do not have permission to access this resource');
            }

            return true;
          } catch (error) {
            if (error instanceof ForbiddenException) {
              throw error;
            }
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
}
