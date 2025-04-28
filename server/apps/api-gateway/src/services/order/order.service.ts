import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Microservice } from '../../constants/microservice';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderStatus,
  UpdateOrderDto,
  UpdateSuborderStatusDto,
} from '@app/common/dtos/order.dto';
import { catchRpcError } from '../../filters/rpc-exception.filter';

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

  getMyOrders(userId: string) {
    return this.orderClient.send<OrderResponseDto[]>({ cmd: 'order.get.my-orders' }, userId);
  }

  getOrder(id: string) {
    return this.orderClient.send<OrderResponseDto>({ cmd: 'order.get.by-id' }, id);
  }

  updateOrder(id: string, dto: UpdateOrderDto) {
    return this.orderClient.send<OrderResponseDto>({ cmd: 'order.update' }, { id, dto });
  }

  cancelOrder(id: string) {
    return this.orderClient.send<OrderResponseDto>({ cmd: 'order.cancel' }, id);
  }

  getRestaurantOrders(restaurantId: string) {
    return this.orderClient.send<OrderResponseDto[]>(
      { cmd: 'order.get.restaurant-orders' },
      restaurantId,
    );
  }

  updateOrderStatus(id: string, suborderId: string, status: OrderStatus) {
    return this.orderClient.send<{ message: string }>(
      { cmd: 'order.updateSuborderStatus' },
      { id, suborderId, status },
    );
  }

  updatePaidStatus(orderId: string, isPaid: boolean) {
    return this.orderClient
      .send<OrderResponseDto>({ cmd: 'order.updatePaidStatus' }, { orderId, isPaid })
      .pipe(catchRpcError('Failed to update order paid status'));
  }

  // getAllOrders(filters: { status?: string; restaurantId?: string }) {
  //   return this.orderClient.send<OrderOutput[]>({ cmd: 'order.get.all' }, filters);
  // }

  handlePaymentCompleted(orderId: string, paymentId: string) {
    return this.orderClient.send<void>({ cmd: 'payment.completed' }, { orderId, paymentId });
  }

  // handleDeliveryAssigned(orderId: string, deliveryPersonId: string) {
  //   return this.orderClient.send<void>({ cmd: 'delivery.assigned' }, { orderId, deliveryPersonId });
  // }
}
