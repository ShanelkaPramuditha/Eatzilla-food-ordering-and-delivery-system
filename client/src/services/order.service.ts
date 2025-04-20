// src/services/OrderService.ts
import { useAxios as axios } from '@/hooks/use-axios';
import type { CheckoutFormValues } from '@/schemas/checkout.schema';
import type { CartItem } from '@/types/cart';

export enum OrderStatus {
  CREATED = 'created',
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_COMPLETED = 'payment_completed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, unknown>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface CreateOrderRequest {
  customerId?: string;
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod?: 'card' | 'cash';
  specialInstructions?: string;
  restaurantId?: string;
}

export interface UpdateOrderRequest {
  specialInstructions?: string;
  deliveryAddress?: Partial<Address>;
  items?: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  deliveryPersonId?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  paymentId?: string;
  paymentMethod?: string;
  isPaid: boolean;
  statusHistory: StatusHistoryItem[];
  specialInstructions?: string;
  isModifiable: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurantId?: string;
}

const OrderService = {
  createOrder: async (cartItems: CartItem[], formData: CheckoutFormValues): Promise<Order> => {
    const items: OrderItem[] = cartItems.map((item) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      customizations: item.customizations,
    }));

    const orderData: CreateOrderRequest = {
      items,
      deliveryAddress: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        postalCode: formData.address.postalCode,
        instructions: formData.address.instructions,
      },
      specialInstructions: formData.specialInstructions,
      paymentMethod: formData.payment,
    };

    const res = await axios.post('/orders', orderData);
    return res.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const res = await axios.get(`/orders/${orderId}`);
    return res.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await axios.get('/orders/my-orders');
    return res.data;
  },

  updateOrder: async (orderId: string, updateData: UpdateOrderRequest): Promise<Order> => {
    const res = await axios.patch(`/orders/${orderId}`, updateData);
    return res.data;
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const res = await axios.post(`/orders/${orderId}/cancel`, { reason });
    return res.data;
  },

  getRestaurantOrders: async (restaurantId: string): Promise<Order[]> => {
    const res = await axios.get(`/orders/restaurant/${restaurantId}`);
    return res.data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    note?: string,
  ): Promise<Order> => {
    const res = await axios.patch(`/orders/${orderId}/status`, { status, note });
    return res.data;
  },

  getAllOrders: async (filters?: {
    status?: OrderStatus;
    restaurantId?: string;
  }): Promise<Order[]> => {
    const res = await axios.get('/orders', { params: filters });
    return res.data;
  },

  // Additional utility methods
  canModifyOrder: (order: Order): boolean => {
    return (
      order.isModifiable && ![OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(order.status)
    );
  },

  calculateEstimatedDeliveryTime: (order: Order): Date | null => {
    if (!order.estimatedDeliveryTime) return null;
    return new Date(order.estimatedDeliveryTime);
  },
};

export default OrderService;
