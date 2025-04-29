import { OrderStatus } from '@/constants/order';
import { useNotifyStore } from '@/store/notify.store';
import { AlertObject } from '@/types/notification';

export class OrderNotificationService {
  private static createOrderNotification(
    orderId: string,
    status: OrderStatus,
    message: string,
    level: 'info' | 'error' | 'warning' = 'info',
  ): AlertObject {
    return {
      response: {
        createdAt: new Date().toISOString(),
        email: '', // Will be populated by backend
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
        userId: '', // Will be populated by auth context
      },
    };
  }

  static notifyOrderCreated(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.CREATED,
      `Order #${orderId.slice(-6)} has been created and is awaiting confirmation.`,
    );
    useNotifyStore.getState().addNotification(notification, 5000);
  }

  static notifyOrderConfirmed(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.CONFIRMED,
      `Order #${orderId.slice(-6)} has placed successfully.`,
    );
    useNotifyStore.getState().addNotification(notification, 5000);
  }

  static notifyOrderPreparing(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.PREPARING,
      `Your order #${orderId.slice(-6)} is now being prepared.`,
    );
    useNotifyStore.getState().addNotification(notification, 5000);
  }

  static notifyOrderReadyForPickup(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.READY_FOR_PICKUP,
      `Order #${orderId.slice(-6)} is ready for pickup by the delivery driver.`,
    );
    useNotifyStore.getState().addNotification(notification, 5000);
  }

  static notifyOrderOutForDelivery(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.OUT_FOR_DELIVERY,
      `Your order #${orderId.slice(-6)} is on the way to you!`,
    );
    useNotifyStore.getState().addNotification(notification, 8000);
  }

  static notifyOrderDelivered(orderId: string): void {
    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.DELIVERED,
      `Order #${orderId.slice(-6)} has been delivered. Enjoy your meal!`,
    );
    useNotifyStore.getState().addNotification(notification, 10000);
  }

  static notifyOrderCancelled(orderId: string, reason?: string): void {
    const message = reason
      ? `Order #${orderId.slice(-6)} has been cancelled. Reason: ${reason}`
      : `Order #${orderId.slice(-6)} has been cancelled.`;

    const notification = this.createOrderNotification(
      orderId,
      OrderStatus.CANCELLED,
      message,
      'warning',
    );
    useNotifyStore.getState().addNotification(notification, 10000);
  }

  static notifyOrderStatusChange(
    orderId: string,
    status: OrderStatus,
    customMessage?: string,
  ): void {
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

    const notification = this.createOrderNotification(orderId, status, message!, level);
    useNotifyStore
      .getState()
      .addNotification(notification, status === OrderStatus.CANCELLED ? 10000 : 5000);
  }
}
