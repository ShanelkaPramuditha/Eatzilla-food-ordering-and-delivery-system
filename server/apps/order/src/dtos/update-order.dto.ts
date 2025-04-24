import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto, AddressDto, CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../schemas/order.schema';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({ description: 'Updated order items', type: [OrderItemDto], required: false })
  items?: OrderItemDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({ description: 'Updated delivery address', type: AddressDto, required: false })
  deliveryAddress?: AddressDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Updated payment method', required: false })
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Updated special instructions', required: false })
  specialInstructions?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Note about the status change', required: false })
  note?: string;
}

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Reason for cancellation' })
  reason: string;
}
