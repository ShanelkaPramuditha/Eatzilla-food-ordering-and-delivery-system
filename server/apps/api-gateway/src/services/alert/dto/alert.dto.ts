import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
  IsEmail,
} from 'class-validator';
import { AlertCategory, AlertLevel, AlertType } from '@app/common/types/alert';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Array of alert types',
    example: [AlertType.EMAIL, AlertType.SMS, AlertType.NOTIFICATION],
    enum: AlertType,
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AlertType, { each: true })
  types: AlertType[];

  // Email
  @IsEmail({}, { each: true })
  @ApiProperty({
    description: 'Email addresses to send alerts to',
    example: 'user1@example.com',
  })
  @IsOptional()
  @IsEmail({}, { each: true })
  email?: string;

  // Mobile
  @IsString()
  @ApiProperty({
    description: 'Mobile number to send alerts to',
    example: '+94771234567',
  })
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsEnum(AlertCategory)
  category: AlertCategory = AlertCategory.DEFAULT;

  @IsObject()
  data: object;

  @ApiProperty({
    description: 'Alert level',
    example: AlertLevel.INFO,
    enum: AlertLevel,
    type: String,
  })
  @IsEnum(AlertLevel)
  @IsOptional()
  level: AlertLevel = AlertLevel.INFO;

  @ApiProperty({
    description: 'Alert subject or title',
    example: 'Your order has been placed',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Alert message content',
    example: 'Your order #12345 has been successfully placed and is being prepared.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
