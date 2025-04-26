import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AlertLevel, AlertType } from '@app/common/types/alert';
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
    description: 'Recipient email, phone, or user identifier',
    example: 'user@example.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  recipient: string;

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
