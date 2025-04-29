import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  UpdateDeliveryPersonAvailabilityDto,
  DeliveryPersonStatusDto,
} from './dtos/delivery-person.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('delivery')
export class DeliveryController {
  private readonly logger = new Logger(DeliveryController.name);

  constructor(private readonly deliveryService: DeliveryService) {}

  @MessagePattern({ cmd: 'get.status' })
  getStatus(): string {
    return this.deliveryService.getStatus();
  }

  // Add message pattern handler for driver availability updates
  @MessagePattern('driver.update.availability')
  async updateDriverAvailabilityMessage(updateDto: UpdateDeliveryPersonAvailabilityDto) {
    this.logger.log(`Received message to update driver availability: ${JSON.stringify(updateDto)}`);
    return this.deliveryService.updateDeliveryPersonAvailability(updateDto);
  }

  // Add message pattern handler for driver status
  @MessagePattern('driver.get.status')
  async getDriverStatusMessage(data: { driverId: string }) {
    this.logger.log(`Received message to get driver status: ${data.driverId}`);
    return this.deliveryService.getDeliveryPersonStatus(data.driverId);
  }

  // Add message pattern handler for finding available drivers
  @MessagePattern('drivers.find.available')
  async findAvailableDriversMessage(data: { lat: number; lng: number; distance?: number }) {
    this.logger.log(`Received message to find available drivers near: ${data.lat}, ${data.lng}`);
    return this.deliveryService.findAvailableDeliveryPersons(
      Number(data.lat),
      Number(data.lng),
      data.distance ? Number(data.distance) : undefined,
    );
  }

  @Post('driver/availability')
  @ApiOperation({ summary: 'Update delivery person availability' })
  @ApiResponse({
    status: 200,
    description: 'Delivery person availability updated successfully',
    type: DeliveryPersonStatusDto,
  })
  async updateDriverAvailability(@Body() updateDto: UpdateDeliveryPersonAvailabilityDto) {
    this.logger.log(
      `Received HTTP request to update driver availability: ${JSON.stringify(updateDto)}`,
    );
    return this.deliveryService.updateDeliveryPersonAvailability(updateDto);
  }

  @Get('driver/:id/status')
  @ApiOperation({ summary: 'Get delivery person status' })
  @ApiParam({ name: 'id', description: 'Delivery person ID' })
  @ApiResponse({
    status: 200,
    description: 'Delivery person status retrieved successfully',
    type: DeliveryPersonStatusDto,
  })
  async getDriverStatus(@Param('id') deliveryPersonId: string) {
    return this.deliveryService.getDeliveryPersonStatus(deliveryPersonId);
  }

  @Get('drivers/available')
  @ApiOperation({ summary: 'Find available delivery persons near a location' })
  @ApiQuery({ name: 'lat', description: 'Latitude coordinate', required: true })
  @ApiQuery({ name: 'lng', description: 'Longitude coordinate', required: true })
  @ApiQuery({ name: 'distance', description: 'Maximum distance in kilometers', required: false })
  @ApiResponse({
    status: 200,
    description: 'Available delivery persons retrieved successfully',
    type: [DeliveryPersonStatusDto],
  })
  async findAvailableDrivers(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance?: number,
  ) {
    return this.deliveryService.findAvailableDeliveryPersons(
      Number(lat),
      Number(lng),
      distance ? Number(distance) : undefined,
    );
  }

  @MessagePattern({ cmd: 'assign.driver' })
  async assignDriverToOrder(data: { deliveryPersonId: string; orderId: string }) {
    this.logger.log(`Assigning driver ${data.deliveryPersonId} to order ${data.orderId}`);
    return this.deliveryService.assignDeliveryPerson(data.deliveryPersonId, data.orderId);
  }

  @MessagePattern({ cmd: 'complete.delivery' })
  async completeDelivery(data: { deliveryPersonId: string }) {
    this.logger.log(`Completing delivery for driver ${data.deliveryPersonId}`);
    return this.deliveryService.completeDelivery(data.deliveryPersonId);
  }
}
