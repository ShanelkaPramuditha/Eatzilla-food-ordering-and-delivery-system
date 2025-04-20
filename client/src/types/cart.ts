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

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, string | number | boolean>;
  image: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: CartItem[];
  deliveryAddress: Address;
  paymentMethod: string;
  specialInstructions?: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';
