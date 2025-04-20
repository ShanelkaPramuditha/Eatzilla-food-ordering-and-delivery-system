import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { JwtPayload, AuthTokens } from '../types/auth';
import { SignInDto, SignUpDto } from '../users/dto';
import { CookieConfigService } from '../config/cookie.config';
import { JwtConfigService } from '../config/jwt.config';

interface RequestWithCookies extends ExpressRequest {
  cookies: { [key: string]: string };
}

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieConfig: CookieConfigService,
    private jwtConfig: JwtConfigService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.authService.signIn(signInDto.email, signInDto.password);
    this.setTokenCookies(response, tokens);
  }

  @Public()
  @Post('register')
  async register(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.authService.register(signUpDto);
    this.setTokenCookies(response, tokens);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = request.cookies[this.cookieConfig.refreshTokenConfig.name];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const tokens = await this.authService.refreshToken(refreshToken);
    this.setTokenCookies(response, tokens);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): void {
    this.clearTokenCookies(response);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }) {
    return this.authService.getProfile(req.user.sub);
  }

  private setTokenCookies(response: Response, tokens: AuthTokens): void {
    response.cookie(this.cookieConfig.accessTokenConfig.name, tokens.access_token, {
      ...this.cookieConfig.secureOptions,
      maxAge: this.cookieConfig.accessTokenConfig.maxAge,
    });

    response.cookie(this.cookieConfig.refreshTokenConfig.name, tokens.refresh_token, {
      ...this.cookieConfig.secureOptions,
      maxAge: this.cookieConfig.refreshTokenConfig.maxAge,
    });
  }

  private clearTokenCookies(response: Response): void {
    response.cookie(this.cookieConfig.accessTokenConfig.name, '', {
      ...this.cookieConfig.secureOptions,
      maxAge: 0,
    });

    response.cookie(this.cookieConfig.refreshTokenConfig.name, '', {
      ...this.cookieConfig.secureOptions,
      maxAge: 0,
    });
  }
}
