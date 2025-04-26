import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Microservice } from '../../constants/microservice';
import { CreateOrderDto, OrderResponseDto } from '@app/common/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(Microservice.ORDER_SERVICE)
    private readonly orderClient: ClientProxy,
  ) {}

  getStatus() {
    return this.orderClient.send({ cmd: 'get.status' }, {});
  }

  createOrder(dto: CreateOrderDto, userId: string) {
    return this.orderClient.send<OrderResponseDto>({ cmd: 'order.create' }, { dto, userId });
  }

  // getMyOrders(userId: string) {
  //   return this.orderClient.send<OrderOutput[]>({ cmd: 'order.get.my-orders' }, { userId });
  // }

  // getOrder(id: string) {
  //   return this.orderClient.send<OrderOutput>({ cmd: 'order.get.by-id' }, { id });
  // }

  // updateOrder(id: string, dto: UpdateOrderInput) {
  //   return this.orderClient.send<OrderOutput>({ cmd: 'order.update' }, { id, dto });
  // }

  // cancelOrder(id: string) {
  //   return this.orderClient.send<OrderOutput>({ cmd: 'order.cancel' }, { id });
  // }

  // getRestaurantOrders(restaurantId: string) {
  //   return this.orderClient.send<OrderOutput[]>(
  //     { cmd: 'order.get.restaurant-orders' },
  //     { restaurantId },
  //   );
  // }

  // updateOrderStatus(id: string, dto: UpdateSuborderStatusInput) {
  //   return this.orderClient.send<OrderOutput>({ cmd: 'order.update.status' }, { id, dto });
  // }

  // getAllOrders(filters: { status?: string; restaurantId?: string }) {
  //   return this.orderClient.send<OrderOutput[]>({ cmd: 'order.get.all' }, filters);
  // }

  // handlePaymentCompleted(orderId: string, paymentId: string) {
  //   return this.orderClient.send<void>({ cmd: 'payment.completed' }, { orderId, paymentId });
  // }

  // handleDeliveryAssigned(orderId: string, deliveryPersonId: string) {
  //   return this.orderClient.send<void>({ cmd: 'delivery.assigned' }, { orderId, deliveryPersonId });
  // }
}
