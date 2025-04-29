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
import { AuthService } from '../../auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(Microservice.ORDER_SERVICE)
    private readonly orderClient: ClientProxy,
    private readonly authService: AuthService,
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

  async getRestaurantOrders(restaurantId: string) {
    // Get all orders for the restaurant as an Observable
    const ordersObservable = this.orderClient.send<OrderResponseDto[]>(
      { cmd: 'order.get.restaurant-orders' },
      restaurantId,
    );

    // Convert the Observable to a Promise to get the orders array
    const orders = await firstValueFrom(ordersObservable);

    // Enhance each order with customer name
    const ordersWithCustomerNames = await Promise.all(
      orders.map(async (order) => {
        // Get customer name using the existing getUserName method
        const customerName = await this.getUserName(order.customerId);

        // Return a new object with the customer name included
        return {
          ...order,
          customerName,
        };
      }),
    );

    return ordersWithCustomerNames;
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
  async getUserName(userId: string): Promise<string> {
    const profile = await this.authService.getProfile(userId);
    return profile.name;
  }
}
