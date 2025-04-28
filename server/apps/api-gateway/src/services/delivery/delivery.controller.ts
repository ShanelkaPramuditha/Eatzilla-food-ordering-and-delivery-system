import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('delivery')
@ApiTags('delivery')
export class DeliveryController {
  private readonly logger = new Logger(DeliveryController.name);

  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  getStatus() {
    return this.deliveryService.getStatus();
  }

  @Post('driver/availability')
  @ApiOperation({ summary: 'Update delivery person availability status and location' })
  @ApiResponse({ status: 200, description: 'Delivery person availability updated successfully' })
  async updateDriverAvailability(@Body() updateDto: any) {
    this.logger.log(`Received driver availability update request: ${JSON.stringify(updateDto)}`);
    return this.deliveryService.updateDriverAvailability(updateDto);
  }

  @Get('driver/:id/status')
  @ApiOperation({ summary: 'Get delivery person status' })
  @ApiParam({ name: 'id', description: 'Delivery person ID' })
  @ApiResponse({ status: 200, description: 'Delivery person status retrieved successfully' })
  async getDriverStatus(@Param('id') driverId: string) {
    return this.deliveryService.getDriverStatus(driverId);
  }

  @Get('drivers/available')
  @ApiOperation({ summary: 'Find available delivery persons near a location' })
  @ApiQuery({ name: 'lat', description: 'Latitude coordinate', required: true })
  @ApiQuery({ name: 'lng', description: 'Longitude coordinate', required: true })
  @ApiQuery({ name: 'distance', description: 'Maximum distance in kilometers', required: false })
  @ApiResponse({ status: 200, description: 'Available delivery persons retrieved successfully' })
  async findAvailableDrivers(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance?: number,
  ) {
    return this.deliveryService.findAvailableDrivers(
      Number(lat),
      Number(lng),
      distance ? Number(distance) : undefined,
    );
  }

  @Post('driver/:driverId/assign/:orderId')
  @ApiOperation({ summary: 'Assign a delivery person to an order' })
  @ApiParam({ name: 'driverId', description: 'Delivery person ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Delivery person assigned successfully' })
  async assignDriverToOrder(
    @Param('driverId') driverId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.deliveryService.assignDriverToOrder(driverId, orderId);
  }

  @Post('driver/:driverId/complete')
  @ApiOperation({ summary: 'Mark a delivery as completed' })
  @ApiParam({ name: 'driverId', description: 'Delivery person ID' })
  @ApiResponse({ status: 200, description: 'Delivery marked as completed successfully' })
  async completeDelivery(@Param('driverId') driverId: string) {
    return this.deliveryService.completeDelivery(driverId);
  }
}
