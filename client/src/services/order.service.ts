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
    }));

    const orderData: CreateOrder = {
      customerId: 'current-user-id', // You'll need to get this from your auth context
      suborders,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
    };

    const res = await axios.post('/orders', orderData);
    return res.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const res = await axios.get(`/orders/${orderId}`);
    return res.data;
  },

  getCustomerOrders: async (customerId: string): Promise<Order[]> => {
    const res = await axios.get(`/orders/customer/${customerId}`);
    return res.data;
  },

  updateOrder: async (orderId: string, updateData: UpdateOrder): Promise<Order> => {
    const res = await axios.patch(`/orders/${orderId}`, updateData);
    return res.data;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    const res = await axios.patch(`/orders/${orderId}`, {
      status: OrderStatus.CANCELLED,
    });
    return res.data;
  },

  getRestaurantOrders: async (restaurantId: string): Promise<Order[]> => {
    const res = await axios.get(`/orders/restaurant/${restaurantId}`);
    return res.data;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const res = await axios.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  getAllOrders: async (filters?: {
    status?: OrderStatus;
    restaurantId?: string;
  }): Promise<Order[]> => {
    const res = await axios.get('/orders', { params: filters });
    return res.data;
  },

  // Utility method to check if order can be modified
  isOrderModifiable: (order: Order): boolean => {
    return [OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(order.status);
  },
};

export default OrderService;
