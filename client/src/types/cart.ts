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

// Order status tracking enum
export enum OrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

// Matches OrderItemDto from the backend
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, unknown>;
}

// CartItem extends OrderItem with UI-specific fields
export interface CartItem extends OrderItem {
  image: string; // For UI display
  restaurantId: string; // For grouping into suborders
}
