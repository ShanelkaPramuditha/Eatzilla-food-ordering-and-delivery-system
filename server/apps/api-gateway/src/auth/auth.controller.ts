import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { JwtPayload, AuthTokens } from '../types/auth';
import { SignInDto, SignUpDto } from '../users/dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<AuthTokens> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  register(@Body() signUpDto: SignUpDto): Promise<AuthTokens> {
    return this.authService.register(signUpDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body('refresh_token') refreshToken: string): Promise<AuthTokens> {
    return this.authService.refreshToken(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }) {
    return this.authService.getProfile(req.user.sub);
  }
}
