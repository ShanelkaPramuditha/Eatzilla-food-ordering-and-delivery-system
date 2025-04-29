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
  async create(req: { dto: CreateOrderDto; userId: string }) {
    const order = await this.orderService.create(req);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.get.my-orders' })
  async getMyOrders(userId: string ) {
    const orders = await this.orderService.findAllByCustomer(userId);
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.findAll' })
  async findAll() {
    const orders = await this.orderService.findAll();
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  @MessagePattern({ cmd: 'order.get.by-id' })
  async findOne(id: string) {
    const order = await this.orderService.findOne(id);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.update' })
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderService.update(id, updateOrderDto);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.updateSuborderStatus' })
  async updateSuborderStatus(req: { id: string; suborderId: string; status: OrderStatus }) {
    console.log('Updating suborder status:', req);
    const order = await this.orderService.updateSuborderStatus(req.id, req.suborderId, req.status);
    return order;
  }

  @MessagePattern({ cmd: 'order.cancel' })
  async remove(id: string) {
    const order = await this.orderService.cancelOrder(id);
    return this.mapToOrderResponseDto(order);
  }

  @MessagePattern({ cmd: 'order.get.restaurant-orders' })
  async findByRestaurant(restaurantId: string) {
    const orders = await this.orderService.findAllByRestaurant(restaurantId);
    return orders.map((order) => this.mapToOrderResponseDto(order));
  }

  // @MessagePattern({ cmd: 'order.getAll' })
  // async getOrdersByStatus(@Query('status') status: OrderStatus) {
  //   const orders = await this.orderService.getOrdersByStatus(status);
  //   return orders.map((order) => this.mapToOrderResponseDto(order));
  // }

  @MessagePattern({cmd: 'payment.completed'})
  async handlePaymentCompleted(req: {orderId : string, paymentId : string}){
    const response = await this.orderService.setPaymentCompleted(req.orderId , req.paymentId)
    return response;
  }

  @MessagePattern({ cmd: 'order.updatePaidStatus' })
  async updatePaymentStatus(payload: { orderId: string; isPaid: boolean }) {
    const { orderId, isPaid } = payload;
    const order = await this.orderService.updatePaymentStatus(orderId, isPaid);
    return this.mapToOrderResponseDto(order);
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
      deliveryPersonId: order.deliveryPersonId?.toString(),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      customerPhoneNumber: order.customerPhoneNumber,
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
