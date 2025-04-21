import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsObject,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';

// ============ ORDER ITEM ============
export class OrderItemDto {
  @ApiProperty({ description: 'Menu item ID' })
  @IsNotEmpty()
  @IsString()
  menuItemId: string;

  @ApiProperty({ description: 'Item name at time of ordering' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price at order time' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Quantity ordered', default: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ description: 'Item customizations', required: false })
  @IsObject()
  @IsOptional()
  customizations?: Record<string, any>;
}

// ============ ADDRESS ============
export class AddressDto {
  @ApiProperty({ description: 'Street address' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'State or province' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'Postal code' })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Delivery instructions', required: false })
  @IsString()
  @IsOptional()
  instructions?: string;
}

// ============ SUBORDER ============
export class SuborderDto {
  @ApiProperty({ description: 'Restaurant ID' })
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @ApiProperty({ description: 'Items from this restaurant', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

// ============ CREATE ORDER ============
export class CreateOrderDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Suborders grouped by restaurant', type: [SuborderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuborderDto)
  suborders: SuborderDto[];

  @ApiProperty({ description: 'Delivery address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty({ description: 'Payment method' })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

// ============ INTERNAL CALCULATED FIELDS ============
export class CalculatedOrderFields {
  @ApiProperty({ description: 'Subtotal amount' })
  subtotal: number;

  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @ApiProperty({ description: 'Tax amount' })
  tax: number;

  @ApiProperty({ description: 'Total amount' })
  total: number;
}

// ============ UPDATE ORDER ============
export class UpdateOrderDto {
  @ApiProperty({ description: 'Order status', enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ description: 'Payment status', required: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiProperty({ description: 'Payment ID', required: false })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiProperty({ description: 'Estimated delivery time', required: false })
  @IsOptional()
  estimatedDeliveryTime?: Date;

  @ApiProperty({ description: 'Actual delivery time', required: false })
  @IsOptional()
  actualDeliveryTime?: Date;

  @ApiProperty({ description: 'Delivery person ID', required: false })
  @IsOptional()
  @IsString()
  deliveryPersonId?: string;
}

// ============ ORDER RESPONSE ============
export class OrderResponseDto extends CalculatedOrderFields {
  @ApiProperty({ description: 'Order ID' })
  _id: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Suborders grouped by restaurant' })
  suborders: any[];

  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  status: OrderStatus;

  @ApiProperty({ description: 'Delivery address' })
  deliveryAddress: AddressDto;

  @ApiProperty({ description: 'Payment method' })
  paymentMethod: string;

  @ApiProperty({ description: 'Payment status' })
  isPaid: boolean;

  @ApiProperty({ description: 'Payment ID', required: false })
  paymentId?: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  specialInstructions?: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

// ============ UPDATE SUBORDER STATUS ============
export class UpdateSuborderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'New status for the suborder' })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
