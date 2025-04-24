import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from '../../auth/decorator/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get('status')
  getStatus() {
    return this.orderService.getStatus();
  }

  @Post()
  createOrder(@Body() dto: any, @Query('userId') userId?: string) {
    return this.orderService.createOrder(dto, userId);
  }

  @Get('my-orders')
  getMyOrders(@Query('userId') userId: string) {
    return this.orderService.getMyOrders(userId);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() dto: any) {
    return this.orderService.updateOrder(id, dto);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Get('restaurant/:restaurantId')
  getRestaurantOrders(@Param('restaurantId') restaurantId: string) {
    return this.orderService.getRestaurantOrders(restaurantId);
  }

  @Patch(':id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: any) {
    return this.orderService.updateOrderStatus(id, dto);
  }

  @Get()
  getAllOrders(@Query('status') status?: string, @Query('restaurantId') restaurantId?: string) {
    return this.orderService.getAllOrders({ status, restaurantId });
  }

  // These are optional external system triggers
  @Post('payment-completed')
  handlePaymentCompleted(@Body() body: { orderId: string; paymentId: string }) {
    return this.orderService.handlePaymentCompleted(body.orderId, body.paymentId);
  }

  @Post('delivery-assigned')
  handleDeliveryAssigned(@Body() body: { orderId: string; deliveryPersonId: string }) {
    return this.orderService.handleDeliveryAssigned(body.orderId, body.deliveryPersonId);
  }
}
