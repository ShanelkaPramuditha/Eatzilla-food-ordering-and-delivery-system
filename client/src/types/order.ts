import { OrderStatus } from "@/constants/order";
import { OrderItem } from "./cart";

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
  subtotal: number;
  status: OrderStatus;
}

// Matches CalculatedOrderFields from the backend
export interface CalculatedOrderFields {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  currency: string;
  total: number;
}

// Matches OrderResponseDto from the backend
export interface Order extends CalculatedOrderFields {
  _id: string;
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
