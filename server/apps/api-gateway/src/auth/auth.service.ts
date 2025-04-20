import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../users/dto';
import { AuthTokens, JwtPayload, RefreshToken } from '../types/auth';
import { JwtConfigService } from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtConfig: JwtConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthTokens> {
    if (!email || !pass) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.usersService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user._id.toString(), user.email, user.role, user.name);
  }

  async register(signUpDto: SignUpDto): Promise<AuthTokens> {
    const user = await this.usersService.create(signUpDto);
    return this.generateTokens(user._id.toString(), user.email, user.role, user.name);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshToken>(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user._id.toString(), user.email, user.role, user.name);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    name: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
      name,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.expiresIn,
      }),
      this.jwtService.signAsync(
        { sub: userId, refreshToken: true },
        {
          secret: this.jwtConfig.refreshSecret,
          expiresIn: this.jwtConfig.refreshExpiresIn,
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    };
  }
}
