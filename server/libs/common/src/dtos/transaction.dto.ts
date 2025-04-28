import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class PaymentSessionDto {
  @ApiPropertyOptional({
    description: 'The order ID associated with the payment',
    example: 'ord_123456',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'The customer ID who made the payment',
    example: 'cus_789012',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Payment Intent ID from the payment processor',
    example: 'pi_3Lt2Lb2eZvKYlo2C0H8JQy0D',
  })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @ApiPropertyOptional({
    description: 'Charge ID from the payment processor',
    example: 'ch_3Lt2Lb2eZvKYlo2C0H8JQy0D',
  })
  @IsOptional()
  @IsString()
  chargeId?: string;

  @ApiProperty({
    description: 'Session ID for the payment',
    example: 'cs_test_a1b2c3d4...',
  })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Amount paid (in smallest currency unit, e.g. cents)',
    example: 1999,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Currency code for the payment',
    example: 'usd',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Current status of the payment',
    example: 'succeeded',
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiProperty({
    description: 'Payment method used',
    example: 'card',
    default: 'card',
  })
  @IsString()
  paymentMethod: string = 'card';

  @ApiPropertyOptional({
    description: 'URL to the payment receipt',
    example: 'https://pay.stripe.com/receipts/...',
  })
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata associated with the payment',
    example: { key1: 'value1', key2: 'value2' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
