import { Controller, Get, Post, Patch, Param, Body, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from '../../auth/decorator/public.decorator';
import { UserRequest } from '../../types/auth';
import { CreateOrderDto, OrderStatus, UpdateOrderDto } from '@app/common/dtos/order.dto';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserRole } from '@app/common/types/user';
import { stat } from 'fs';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get()
  getStatus() {
    return this.orderService.getStatus();
  }

  @Post()
  @Roles(UserRole.CUSTOMER)
  createOrder(@Req() req: UserRequest, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user?.sub;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('my-orders')
  @Roles(UserRole.CUSTOMER)
  getMyOrders(@Req() req: UserRequest) {
    const userId = req.user?.sub;
    return this.orderService.getMyOrders(userId);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Patch(':id')
  @Roles(UserRole.CUSTOMER)
  updateOrder(@Param('id') id: string, @Body() dto: any) {
    return this.orderService.updateOrder(id, dto);
  }

  @Roles(UserRole.CUSTOMER, UserRole.RESTAURANT_OWNER)
  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Roles(UserRole.RESTAURANT_OWNER)
  @Get('restaurant/:restaurantId')
  getRestaurantOrders(@Param('restaurantId') restaurantId: string) {
    return this.orderService.getRestaurantOrders(restaurantId);
  }

  @Roles(UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_PERSON)
  @Patch(':id/suborder/:suborderId/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Param('suborderId') suborderId: string,
    @Body() status: { status: OrderStatus },
  ) {
    return this.orderService.updateOrderStatus(id, suborderId, status.status);
  }

  // @Get('get-all')
  // getAllOrders(@Query('status') status?: string, @Query('restaurantId') restaurantId?: string) {
  //   return this.orderService.getAllOrders({ status, restaurantId });
  // }

  // These are optional external system triggers
  @Post('payment-completed')
  handlePaymentCompleted(@Body() body: { orderId: string; paymentId: string }) {
    return this.orderService.handlePaymentCompleted(body.orderId, body.paymentId);
  }

  // @Post('delivery-assigned')
  // handleDeliveryAssigned(@Body() body: { orderId: string; deliveryPersonId: string }) {
  //   return this.orderService.handleDeliveryAssigned(body.orderId, body.deliveryPersonId);
  // }
}
