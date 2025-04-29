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

export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

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

  @ApiProperty({ description: 'Latitude for geolocation', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude for geolocation', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

// ============ SUBORDER ============
export class SuborderDto {
  @ApiProperty({ description: 'Suborder ID' })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'Restaurant ID' })
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @ApiProperty({ description: 'Items from this restaurant', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Subtotal for these items' })
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({ enum: OrderStatus, description: 'Suborder status' })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

// ============ CREATE ORDER ============
export class CreateOrderDto {
  @ApiProperty({ description: 'Suborders grouped by restaurant', type: [SuborderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuborderDto)
  suborders: SuborderDto[];

  @ApiProperty({ description: 'Customer Phone Number' })
  @IsNotEmpty()
  @IsString()
  customerPhoneNumber: string;

  @ApiProperty({ description: 'Delivery address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty({ description: 'Payment method', required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ description: 'Payment ID', required: false })
  @IsString()
  @IsOptional()
  paymentId?: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

// ============ INTERNAL CALCULATED FIELDS ============
export class CalculatedOrderFields {
  @ApiProperty({ description: 'Subtotal amount' })
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({ description: 'Delivery fee' })
  @IsNumber()
  @IsPositive()
  deliveryFee: number;

  @ApiProperty({ description: 'Tax amount' })
  @IsNumber()
  @IsPositive()
  tax: number;

  @ApiProperty({ description: 'Total amount' })
  @IsNumber()
  @IsPositive()
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

  @ApiProperty({ description: 'Delivery Person ID', required: false })
  @IsOptional()
  @IsString()
  deliveryPersonId?: string;

  @ApiProperty({ description: 'Payment ID', required: false })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiProperty({ description: 'Payment method', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

// ============ ORDER RESPONSE DTO ============
export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID' })
  _id: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Delivery Person ID' })
  deliveryPersonId?: string;

  @ApiProperty({ description: 'Suborders grouped by restaurant' })
  suborders: SuborderDto[];

  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  status: OrderStatus;

  @ApiProperty({ description: 'Customer Phone Number' })
  customerPhoneNumber: string;

  @ApiProperty({ description: 'Delivery address' })
  deliveryAddress: AddressDto;

  @ApiProperty({ description: 'Subtotal amount' })
  subtotal: number;

  @ApiProperty({ description: 'Default currency' })
  currency: string;

  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @ApiProperty({ description: 'Tax amount' })
  tax: number;

  @ApiProperty({ description: 'Total amount' })
  total: number;

  @ApiProperty({ description: 'Payment method', required: false })
  paymentMethod?: string;

  @ApiProperty({ description: 'Payment status' })
  isPaid: boolean;

  @ApiProperty({ description: 'Payment ID', required: false })
  paymentId?: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  specialInstructions?: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt?: Date;
}

// ============ UPDATE SUBORDER STATUS ============
export class UpdateSuborderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'New status for the suborder' })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
