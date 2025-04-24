// import { v4 as uuidv4 } from 'uuid';
// import { Address, CartItem, Order, OrderStatus, Suborder } from '@/types/cart';
// import { calculateCartTotal } from './cart';

// // Save orders to localStorage
// export const saveOrders = (orders: Order[]): void => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('food-ordering-orders', JSON.stringify(orders));
//   }
// };

// // Load orders from localStorage
// export const loadOrders = (): Order[] => {
//   if (typeof window !== 'undefined') {
//     const orders = localStorage.getItem('food-ordering-orders');
//     return orders ? JSON.parse(orders) : [];
//   }
//   return [];
// };

// // Group cart items by restaurant and convert to suborders
// const createSubordersFromCart = (items: CartItem[]): Suborder[] => {
//   // Group items by restaurant
//   const restaurantGroups: Record<string, CartItem[]> = {};

//   items.forEach((item) => {
//     const restaurantId = item.restaurantId || 'default-restaurant';
//     if (!restaurantGroups[restaurantId]) {
//       restaurantGroups[restaurantId] = [];
//     }
//     restaurantGroups[restaurantId].push(item);
//   });

//   // Convert groups to suborders
//   return Object.entries(restaurantGroups).map(([restaurantId, items]) => ({
//     restaurantId,
//     items: items.map((item) => ({
//       menuItemId: item.menuItemId,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       customizations: item.customizations,
//     })),
//   }));
// };

// // Create a new order
// export const createOrder = (
//   items: CartItem[],
//   deliveryAddress: Address,
//   paymentMethod: string,
//   specialInstructions?: string,
// ): Order => {
//   const subtotal = calculateCartTotal(items);
//   const deliveryFee = 3.99;
//   const tax = subtotal * 0.08;
//   const total = subtotal + deliveryFee + tax;

//   const suborders = createSubordersFromCart(items);

//   const now = new Date();

//   const order: Order = {
//     _id: uuidv4(),
//     customerId: 'guest-user',
//     suborders,
//     deliveryAddress,
//     paymentMethod,
//     specialInstructions,
//     status: OrderStatus.CREATED,
//     isPaid: false,
//     subtotal,
//     deliveryFee,
//     tax,
//     total,
//     createdAt: now,
//     updatedAt: now,
//   };

//   // Save order to localStorage
//   const orders = loadOrders();
//   orders.push(order);
//   saveOrders(orders);

//   return order;
// };

// // Get order by ID
// export const getOrderById = (orderId: string): Order | undefined => {
//   const orders = loadOrders();
//   return orders.find((order) => order._id === orderId);
// };

// // Update order status
// export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | undefined => {
//   const orders = loadOrders();
//   const orderIndex = orders.findIndex((order) => order._id === orderId);

//   if (orderIndex >= 0) {
//     orders[orderIndex].status = status;
//     orders[orderIndex].updatedAt = new Date();
//     saveOrders(orders);
//     return orders[orderIndex];
//   }

//   return undefined;
// };

// // Update a specific suborder status
// export const updateSuborderStatus = (
//   orderId: string,
//   restaurantId: string,
//   status: OrderStatus,
// ): Order | undefined => {
//   const orders = loadOrders();
//   const orderIndex = orders.findIndex((order) => order._id === orderId);

//   if (orderIndex >= 0) {
//     const order = orders[orderIndex];
//     const suborderIndex = order.suborders.findIndex(
//       (suborder) => suborder.restaurantId === restaurantId,
//     );

//     if (suborderIndex >= 0) {
//       // In a real implementation with the backend, we would call an API
//       // to update just the suborder status

//       // For now, we'll update the main order status as a simplification
//       order.status = status;
//       order.updatedAt = new Date();
//       saveOrders(orders);
//     }

//     return orders[orderIndex];
//   }

//   return undefined;
// };

// // Set payment information for an order
// export const setOrderPayment = (
//   orderId: string,
//   isPaid: boolean,
//   paymentId?: string,
// ): Order | undefined => {
//   const orders = loadOrders();
//   const orderIndex = orders.findIndex((order) => order._id === orderId);

//   if (orderIndex >= 0) {
//     orders[orderIndex].isPaid = isPaid;
//     if (paymentId) {
//       orders[orderIndex].paymentId = paymentId;
//     }
//     orders[orderIndex].updatedAt = new Date();
//     saveOrders(orders);
//     return orders[orderIndex];
//   }

//   return undefined;
// };

// // Set estimated delivery time
// export const setEstimatedDeliveryTime = (
//   orderId: string,
//   estimatedTime: Date,
// ): Order | undefined => {
//   const orders = loadOrders();
//   const orderIndex = orders.findIndex((order) => order._id === orderId);

//   if (orderIndex >= 0) {
//     orders[orderIndex].estimatedDeliveryTime = estimatedTime;
//     orders[orderIndex].updatedAt = new Date();
//     saveOrders(orders);
//     return orders[orderIndex];
//   }

//   return undefined;
// };
