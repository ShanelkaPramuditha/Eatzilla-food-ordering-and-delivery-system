import { OrderStatus } from '@/types/cart';

// Delivery-specific status options - keeping for backward compatibility but should use OrderStatus
export enum DeliveryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Map between delivery status and order status
export const deliveryToOrderStatusMap = {
  [DeliveryStatus.PENDING]: OrderStatus.CONFIRMED,
  [DeliveryStatus.ACCEPTED]: OrderStatus.PREPARING,
  [DeliveryStatus.IN_TRANSIT]: OrderStatus.OUT_FOR_DELIVERY,
  [DeliveryStatus.DELIVERED]: OrderStatus.DELIVERED,
  [DeliveryStatus.CANCELLED]: OrderStatus.CANCELLED,
};

// Location type for map coordinates
export interface Location {
  lat: number;
  lng: number;
}

// Restaurant location information
export interface RestaurantLocation {
  id: string;
  name: string;
  address: string;
  location: Location;
}

// Customer information
export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
}

// Drop-off location details
export interface DropLocation {
  address: string;
  location: Location;
}

// Order item in a delivery
export interface DeliveryOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

// Main delivery order type for delivery personnel
export interface DeliveryOrder {
  id: string;
  orderId: string;
  orderItems: DeliveryOrderItem[];
  restaurant: RestaurantLocation;
  customer: CustomerInfo;
  dropLocation: DropLocation;
  status: string;
  orderStatus: OrderStatus; // Using the same OrderStatus enum from cart
  isPaid: boolean; // Added payment status
  deliveryFee: number;
  total: number;
  estimatedDeliveryTime?: number; // in minutes
  distance?: number; // in miles/km
  createdAt: Date;
  deliveredAt?: Date;
  acceptedAt?: Date;
  deliveryPersonId?: string;
  paymentMethod?: string;
  paymentId?: string;
}

// Delivery metrics for statistics
export interface DeliveryMetrics {
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  totalEarnings: number;
  averageRating: number;
  onTimeRate: number;
}

// Delivery route information for maps
export interface DeliveryRoute {
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  distance: number;
  duration: number;
  polyline?: string;
}

// Current location and status for real-time tracking
export interface DeliveryTracking {
  deliveryId: string;
  currentLocation: Location;
  status: DeliveryStatus;
  estimatedArrival: Date;
  lastUpdated: Date;
}
