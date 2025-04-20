import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
// import { Types } from 'mongoose';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Menu item ID' })
  menuItemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Item name' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Item price' })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Quantity ordered', default: 1 })
  quantity: number;

  @IsObject()
  @IsOptional()
  @ApiProperty({ description: 'Any customizations to the item', required: false })
  customizations?: Record<string, any>;
}

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Street address' })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'City' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'State or province' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Delivery instructions', required: false })
  instructions?: string;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({ description: 'Array of order items', type: [OrderItemDto] })
  items: OrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({ description: 'Delivery address details', type: AddressDto })
  deliveryAddress: AddressDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Payment method', required: false })
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Special instructions for the order', required: false })
  specialInstructions?: string;
}
