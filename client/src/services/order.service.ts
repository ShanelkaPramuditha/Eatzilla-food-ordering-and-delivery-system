// src/services/OrderService.ts
import { OrderStatus } from '@/constants/order';
import { useAxios as axios } from '@/hooks/use-axios';
import { CartItem } from '@/types/cart';
import { OrderItem } from '@/types/cart';
import { Address, Suborder, Order, CreateOrder, UpdateOrder } from '@/types/order';

const OrderService = {
  createOrder: async (
    cartItems: CartItem[],
    deliveryAddress: Address,
    paymentMethod: string,
    specialInstructions?: string,
  ): Promise<Order> => {
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

  getStatus: async (): Promise<any> => {
    const res = await axios.get('/order');
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
    const res = await axios.patch(`/order/${orderId}/cancel`);
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

  updateSuborderStatus: async (
    orderId: string,
    suborderId: string,
    status: OrderStatus,
  ): Promise<Order> => {
    const res = await axios.patch(`/order/${orderId}/suborder/${suborderId}/status`, { status });
    return res.data;
  },

  handlePaymentCompleted: async (orderId: string, paymentId: string): Promise<any> => {
    const res = await axios.post('/order/payment-completed', { orderId, paymentId });
    return res.data;
  },

  // If needed in future
  // handleDeliveryAssigned: async (
  //   orderId: string,
  //   deliveryPersonId: string,
  // ): Promise<any> => {
  //   const res = await axios.post('/order/delivery-assigned', { orderId, deliveryPersonId });
  //   return res.data;
  // },

  isOrderModifiable: (order: Order): boolean => {
    return [OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(order.status);
  },
};

export default OrderService;
