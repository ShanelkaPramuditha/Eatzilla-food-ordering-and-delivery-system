// src/services/OrderService.ts
import { useAxios as axios } from '@/hooks/use-axios';
import { CartItem } from '@/types/cart';
import {
  OrderStatus,
  OrderItem,
  Address,
  Suborder,
  Order,
  CreateOrder,
  UpdateOrder,
} from '@/types/cart';

const OrderService = {
  createOrder: async (
    cartItems: CartItem[],
    deliveryAddress: Address,
    paymentMethod: string,
    specialInstructions?: string,
  ): Promise<Order> => {
    // Group items by restaurant
    const restaurantGroups: Record<string, OrderItem[]> = {};

    cartItems.forEach((item) => {
      if (!restaurantGroups[item.restaurantId]) {
        restaurantGroups[item.restaurantId] = [];
      }
      restaurantGroups[item.restaurantId].push({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
      });
    });

    // Convert to suborders
    const suborders: Suborder[] = Object.entries(restaurantGroups).map(([restaurantId, items]) => ({
      restaurantId,
      items,
      subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      status: OrderStatus.CREATED,
    }));

    const orderData: CreateOrder = {
      suborders,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
    };

    const res = await axios.post('/order', orderData);
    return res.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const res = await axios.get(`/order/${orderId}`);
    return res.data;
  },

  getCustomerOrders: async (): Promise<Order[]> => {
    const res = await axios.get(`/order/my-orders`);
    return res.data;
  },

  updateOrder: async (orderId: string, updateData: UpdateOrder): Promise<Order> => {
    const res = await axios.patch(`/order/${orderId}`, updateData);
    return res.data;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    const res = await axios.patch(`/order/${orderId}`, {
      status: OrderStatus.CANCELLED,
    });
    return res.data;
  },

  getRestaurantOrders: async (restaurantId: string): Promise<Order[]> => {
    const res = await axios.get(`/order/restaurant/${restaurantId}`);
    return res.data;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const res = await axios.patch(`/order/${orderId}/status`, { status });
    return res.data;
  },

  getAllOrders: async (filters?: {
    status?: OrderStatus;
    restaurantId?: string;
  }): Promise<Order[]> => {
    const res = await axios.get('/order', { params: filters });
    return res.data;
  },

  // Utility method to check if order can be modified
  isOrderModifiable: (order: Order): boolean => {
    return [OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(order.status);
  },
};

export default OrderService;
