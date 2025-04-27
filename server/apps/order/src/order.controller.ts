import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateSuborderStatusDto,
  OrderResponseDto,
  OrderStatus,
} from '@app/common/dtos/order.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // get status of the order service
  @MessagePattern({ cmd: 'get.status' })
  getStatus(): string {
    return this.orderService.getStatus();
  }

  @MessagePattern({ cmd: 'order.create' })
  async create(@Body() req: { dto: CreateOrderDto; userId: string }) {
    const order = await this.orderService.create(req);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.findAll' })
  async findAll() {
    const orders = await this.orderService.findAll();
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.findOne' })
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.update' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const order = await this.orderService.update(id, updateOrderDto);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.updateSuborderStatus' })
  async updateSuborderStatus(
    @Param('id') orderId: string,
    @Param('suborderId') suborderId: string,
    @Body() updateSuborderStatusDto: UpdateSuborderStatusDto,
  ) {
    const order = await this.orderService.updateSuborderStatus(
      orderId,
      suborderId,
      updateSuborderStatusDto,
    );
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.remove' })
  async remove(@Param('id') id: string) {
    const order = await this.orderService.remove(id);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.removeSuborder' })
  async findByCustomer(@Param('customerId') customerId: string) {
    const orders = await this.orderService.findAllByCustomer(customerId);
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.findByRestaurant' })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    const orders = await this.orderService.findAllByRestaurant(restaurantId);
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.getAll' })
  async getOrdersByStatus(@Query('status') status: OrderStatus) {
    const orders = await this.orderService.getOrdersByStatus(status);
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.getRestaurantSuborders' })
  async getRestaurantSuborders(
    @Param('restaurantId') restaurantId: string,
    @Query('status') status?: OrderStatus,
  ) {
    return await this.orderService.getRestaurantSuborders(restaurantId, status);
  }

  // Helper method to map MongoDB document to DTO
  private mapToOrderResponseDto(order: any): OrderResponseDto {
    return {
      _id: order._id.toString(),
      customerId: order.customerId.toString(),
      suborders: order.suborders.map((suborder) => ({
        _id: suborder._id.toString(),
        restaurantId: suborder.restaurantId.toString(),
        items: suborder.items.map((item) => ({
          menuItemId: item.menuItemId.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
        subtotal: suborder.subtotal,
        status: suborder.status,
      })),
      currency: order.currency,
      deliveryAddress: order.deliveryAddress,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId,
      isPaid: order.isPaid,
      specialInstructions: order.specialInstructions,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
