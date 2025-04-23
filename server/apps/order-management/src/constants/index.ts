export const ORDER_STATUSES = {
  CREATED: 'created',
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_COMPLETED: 'payment_completed',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const RABBITMQ_QUEUES = {
  ORDER: 'order_queue',
  RESTAURANT: 'restaurant_queue',
  PAYMENT: 'payment_queue',
  DELIVERY: 'delivery_queue',
  NOTIFICATION: 'notification_queue',
};

export const ROLES_ALLOWED = {
  UPDATE_ORDER_STATUS: ['admin', 'restaurant_owner', 'delivery_person'],
  VIEW_ALL_ORDERS: ['admin'],
  VIEW_RESTAURANT_ORDERS: ['admin', 'restaurant_owner'],
};
