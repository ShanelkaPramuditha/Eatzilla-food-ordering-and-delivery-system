// OrderStatus enum aligned with the DTO
export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Core types for the food ordering application
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  available: boolean;
  popular?: boolean;
  restaurantId: string; // Needed to group items by restaurant
  customizationOptions?: CustomizationOption[];
}

export interface CustomizationOption {
  name: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
}

// Matches OrderItemDto from the backend
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, any>;
}

// CartItem extends OrderItem with UI-specific fields
export interface CartItem extends OrderItem {
  image: string; // For UI display
  restaurantId: string; // For grouping into suborders
}

// Matches AddressDto from the backend
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string;
}

// Matches SuborderDto from the backend
export interface Suborder {
  restaurantId: string;
  items: OrderItem[];
}

// Matches CalculatedOrderFields from the backend
export interface CalculatedOrderFields {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// Matches OrderResponseDto from the backend
export interface Order extends CalculatedOrderFields {
  _id: string;
  customerId: string;
  suborders: Suborder[];
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: string;
  isPaid: boolean;
  paymentId?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
}

// Matches CreateOrderDto from the backend
export interface CreateOrder {
  customerId: string;
  suborders: Suborder[];
  deliveryAddress: Address;
  paymentMethod: string;
  specialInstructions?: string;
}

// Matches UpdateOrderDto from the backend
export interface UpdateOrder {
  status?: OrderStatus;
  isPaid?: boolean;
  paymentId?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  deliveryPersonId?: string;
}

// Matches UpdateSuborderStatusDto from the backend
export interface UpdateSuborderStatus {
  status: OrderStatus;
}
