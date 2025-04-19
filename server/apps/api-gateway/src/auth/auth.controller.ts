import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { JwtPayload } from '../types/auth';
import { SignInDto, SignUpDto } from '../users/dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  register(@Body() signUpDto: SignUpDto): Promise<{ access_token: string }> {
    return this.authService.register(signUpDto);
  }

  // Get profile by passing the JWT token in the Authorization header
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }) {
    return this.authService.getProfile(req.user.sub);
  }
}
