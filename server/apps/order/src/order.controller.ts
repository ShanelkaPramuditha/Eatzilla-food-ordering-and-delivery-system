
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateSuborderStatusDto,
  OrderResponseDto,
} from './dtos/create-order.dto';
import { OrderStatus } from './schemas/order.schema';
import { Types } from 'mongoose';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create Order
  @MessagePattern({ cmd: 'order.create' })
  async createOrder(
    @Payload() payload: { dto: CreateOrderDto; userId?: string },
  ): Promise<OrderResponseDto> {
    const dto = payload.dto;
    if (!dto.customerId && payload.userId) {
      dto.customerId = payload.userId;
    }
    return this.orderService.create(dto);
  }

  // Get My Orders
  @MessagePattern({ cmd: 'order.get.my-orders' })
  async getMyOrders(@Payload() payload: { userId: string }): Promise<OrderResponseDto[]> {
    return this.orderService.findByCustomer(payload.userId);
  }

  // Get Order by ID
  @MessagePattern({ cmd: 'order.get.by-id' })
  async getOrder(@Payload() payload: { id: string }): Promise<OrderResponseDto> {
    return this.orderService.findOne(payload.id);
  }

  // Update Order
  @MessagePattern({ cmd: 'order.update' })
  async updateOrder(
    @Payload() payload: { id: string; dto: UpdateOrderDto },
  ): Promise<OrderResponseDto> {
    return this.orderService.update(payload.id, payload.dto);
  }

  // Cancel Order
  @MessagePattern({ cmd: 'order.cancel' })
  async cancelOrder(@Payload() payload: { id: string }): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(payload.id, { status: OrderStatus.CANCELLED });
  }

  // Get Restaurant Orders
  @MessagePattern({ cmd: 'order.get.restaurant-orders' })
  async getRestaurantOrders(
    @Payload() payload: { restaurantId: string },
  ): Promise<OrderResponseDto[]> {
    return this.orderService.findByRestaurant(payload.restaurantId);
  }

  // Update Order Status
  @MessagePattern({ cmd: 'order.update.status' })
  async updateOrderStatus(
    @Payload() payload: { id: string; dto: UpdateSuborderStatusDto },
  ): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(payload.id, payload.dto);
  }

  // Get All Orders (Admin)
  @MessagePattern({ cmd: 'order.get.all' })
  async getAllOrders(
    @Payload() payload: { status?: OrderStatus; restaurantId?: string },
  ): Promise<OrderResponseDto[]> {
    const filters: { status?: OrderStatus; restaurantId?: string } = {};
    if (payload.status) filters.status = payload.status;
    if (payload.restaurantId) filters.restaurantId = payload.restaurantId;
    return this.orderService.findAll(filters);
  }

  // Payment Completed Handler
  @MessagePattern({ cmd: 'payment.completed' })
  async handlePaymentCompleted(
    @Payload() data: { orderId: string; paymentId: string },
  ): Promise<void> {
    await this.orderService.update(data.orderId, {
      isPaid: true,
      paymentId: data.paymentId,
      status: OrderStatus.CONFIRMED,
    });
  }

  // Delivery Assigned Handler
  @MessagePattern({ cmd: 'delivery.assigned' })
  async handleDeliveryAssigned(
    @Payload() data: { orderId: string; deliveryPersonId: string },
  ): Promise<void> {
    if (!data.deliveryPersonId || !Types.ObjectId.isValid(data.deliveryPersonId)) {
      throw new Error('Invalid delivery person ID');
    }

    const order = await this.orderService.findOne(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderService.update(data.orderId, {
      deliveryPersonId: new Types.ObjectId(data.deliveryPersonId).toString(),
      status: OrderStatus.OUT_FOR_DELIVERY,
    });
  }
}
