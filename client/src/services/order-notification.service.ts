import { OrderStatus } from '@/constants/order';
import { AlertObject } from '@/types/notification';

export class OrderNotificationService {
  private static createOrderNotification(
    orderId: string,
    status: OrderStatus,
    message: string,
    level: 'info' | 'error' | 'warning' = 'info',
  ): AlertObject {
    return {
      createdAt: new Date().toISOString(),
      id: `order-status-${Date.now()}`,
      category: 'order',
      data: {
        orderId,
        status,
        timestamp: new Date().toISOString(),
      },
      isRead: false,
      level,
      message,
      mobile: '',
      status: 'sent',
      subject: `Order Status Update: ${orderId}`,
      updatedAt: new Date().toISOString(),
      userId: '',
    };
  }

  static notifyOrderCreated(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.CREATED,
      `Order #${orderId.slice(-6)} has been created and is awaiting confirmation.`,
    );
  }

  static notifyOrderConfirmed(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.CONFIRMED,
      `Order #${orderId.slice(-6)} has placed successfully.`,
    );
  }

  static notifyOrderPreparing(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.PREPARING,
      `Your order #${orderId.slice(-6)} is now being prepared.`,
    );
  }

  static notifyOrderReadyForPickup(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.READY_FOR_PICKUP,
      `Order #${orderId.slice(-6)} is ready for pickup by the delivery driver.`,
    );
  }

  static notifyOrderOutForDelivery(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.OUT_FOR_DELIVERY,
      `Your order #${orderId.slice(-6)} is on the way to you!`,
    );
  }

  static notifyOrderDelivered(orderId: string): AlertObject {
    return this.createOrderNotification(
      orderId,
      OrderStatus.DELIVERED,
      `Order #${orderId.slice(-6)} has been delivered. Enjoy your meal!`,
    );
  }

  static notifyOrderCancelled(orderId: string, reason?: string): AlertObject {
    const message = reason
      ? `Order #${orderId.slice(-6)} has been cancelled. Reason: ${reason}`
      : `Order #${orderId.slice(-6)} has been cancelled.`;

    return this.createOrderNotification(orderId, OrderStatus.CANCELLED, message, 'warning');
  }

  static notifyOrderStatusChange(
    orderId: string,
    status: OrderStatus,
    customMessage?: string,
  ): AlertObject {
    let message = customMessage;
    let level: 'info' | 'error' | 'warning' = 'info';

    if (!customMessage) {
      switch (status) {
        case OrderStatus.CREATED:
          message = `Order #${orderId.slice(-6)} has been created and is awaiting confirmation.`;
          break;
        case OrderStatus.CONFIRMED:
          message = `Order #${orderId.slice(-6)} has been placed successfully.`;
          break;
        case OrderStatus.PREPARING:
          message = `Your order #${orderId.slice(-6)} is now being prepared.`;
          break;
        case OrderStatus.READY_FOR_PICKUP:
          message = `Order #${orderId.slice(-6)} is ready for pickup by the delivery driver.`;
          break;
        case OrderStatus.OUT_FOR_DELIVERY:
          message = `Your order #${orderId.slice(-6)} is on the way to you!`;
          break;
        case OrderStatus.DELIVERED:
          message = `Order #${orderId.slice(-6)} has been delivered. Enjoy your meal!`;
          break;
        case OrderStatus.CANCELLED:
          message = `Order #${orderId.slice(-6)} has been cancelled.`;
          level = 'warning';
          break;
        default:
          message = `Order #${orderId.slice(-6)} status updated to ${status}.`;
      }
    }

    return this.createOrderNotification(orderId, status, message!, level);
  }
}
