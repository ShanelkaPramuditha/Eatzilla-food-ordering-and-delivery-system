import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for location coordinates
export class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 6.9271 })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate', example: 79.8612 })
  @IsNotEmpty()
  lng: number;
}

// DTO for updating delivery person availability
export class UpdateDeliveryPersonAvailabilityDto {
  @ApiProperty({ description: 'Delivery person ID', example: 'driver-001' })
  @IsString()
  @IsNotEmpty()
  deliveryPersonId: string;

  @ApiProperty({ description: 'Availability status', example: true })
  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Current GPS location',
    type: LocationDto,
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  currentLocation?: LocationDto;

  @ApiProperty({
    description: 'ISO timestamp of the update',
    example: '2025-04-28T10:30:00.000Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  timestamp?: string;
}

// DTO for delivery person status response
export class DeliveryPersonStatusDto {
  @ApiProperty({ description: 'Delivery person ID' })
  deliveryPersonId: string;

  @ApiProperty({ description: 'Availability status' })
  isAvailable: boolean;

  @ApiProperty({ description: 'Current GPS location', type: LocationDto, required: false })
  currentLocation?: LocationDto;

  @ApiProperty({ description: 'Status', enum: ['online', 'offline', 'busy'] })
  status: string;

  @ApiProperty({ description: 'Whether on active delivery', required: false })
  isOnDelivery?: boolean;

  @ApiProperty({ description: 'Current order ID if on delivery', required: false })
  currentOrderId?: string;

  @ApiProperty({ description: 'Last updated timestamp' })
  lastUpdated: Date;
}
