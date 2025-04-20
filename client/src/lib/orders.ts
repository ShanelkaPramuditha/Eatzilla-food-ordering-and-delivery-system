import { v4 as uuidv4 } from 'uuid';
import { Address, CartItem, Order, OrderStatus } from '@/types';
import { calculateCartTotal } from './cart';

// Save orders to localStorage
export const saveOrders = (orders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('food-ordering-orders', JSON.stringify(orders));
  }
};

// Load orders from localStorage
export const loadOrders = (): Order[] => {
  if (typeof window !== 'undefined') {
    const orders = localStorage.getItem('food-ordering-orders');
    return orders ? JSON.parse(orders) : [];
  }
  return [];
};

// Create a new order
export const createOrder = (
  items: CartItem[], 
  deliveryAddress: Address, 
  paymentMethod: string, 
  specialInstructions?: string
): Order => {
  const total = calculateCartTotal(items);
  
  const order: Order = {
    id: uuidv4(),
    customerId: 'guest-user', // In a real app, this would be the logged-in user's ID
    restaurantId: 'main-restaurant', // In a real app with multiple restaurants
    items,
    deliveryAddress,
    paymentMethod,
    specialInstructions,
    status: 'pending',
    total,
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: getEstimatedDeliveryTime(),
  };
  
  // Save order to localStorage
  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  
  return order;
};

// Get order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  const orders = loadOrders();
  return orders.find(order => order.id === orderId);
};

// Update order status
export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | undefined => {
  const orders = loadOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    orders[orderIndex].status = status;
    saveOrders(orders);
    return orders[orderIndex];
  }
  
  return undefined;
};

// Helper function to calculate estimated delivery time (30-45 min from now)
const getEstimatedDeliveryTime = (): string => {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + (30 + Math.floor(Math.random() * 15)) * 60000);
  return deliveryTime.toISOString();
};