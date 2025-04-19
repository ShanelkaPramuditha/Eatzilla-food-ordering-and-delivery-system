/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'user@example.com',
    format: 'email',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Account password (6-50 characters)',
    example: 'SecurePassword123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?=.*\d)(?=.*[a-zA-Z]).*/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
