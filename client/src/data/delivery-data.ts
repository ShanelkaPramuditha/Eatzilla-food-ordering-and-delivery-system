import { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import { OrderStatus } from '@/types/cart';

// Sample delivery orders with complete information for delivery management
export const deliveryOrders: DeliveryOrder[] = [
  {
    id: 'del-001',
    orderId: 'ord-65f23a7bc91d',
    orderItems: [
      {
        itemId: '662b8b11c6d3f2f5938b1d11',
        name: 'Classic Cheeseburger',
        quantity: 2,
        price: 12.99,
      },
      {
        itemId: '662b8b7dc6d3f2f5938b1d16',
        name: 'BBQ Chicken Wings',
        quantity: 1,
        price: 11.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d01',
      name: 'Burger Haven',
      address: '25 York Street, Fort, Colombo 01',
      location: {
        lat: 6.9321,
        lng: 79.8436,
      },
    },
    customer: {
      id: 'cust-001',
      name: 'John Smith',
      phone: '077-123-4567',
    },
    dropLocation: {
      address: '5 McCallum Road, Colombo 01000, Sri Lanka',
      location: {
        lat: 6.92705,
        lng: 79.85833,
      },
    },
    status: DeliveryStatus.PENDING,
    orderStatus: OrderStatus.CONFIRMED,
    isPaid: true,
    deliveryFee: 4.99,
    total: 42.96,
    createdAt: new Date('2025-04-27T14:30:00'),
    paymentMethod: 'credit_card',
    paymentId: 'pay_65f23a7bc91d456',
  },
  {
    id: 'del-002',
    orderId: 'ord-65f23b19d02e',
    orderItems: [
      {
        itemId: '662b8b2fc6d3f2f5938b1d12',
        name: 'Margherita Pizza',
        quantity: 1,
        price: 14.99,
      },
      {
        itemId: '662b8bc3c6d3f2f5938b1d1a',
        name: 'Greek Salad',
        quantity: 1,
        price: 10.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d02',
      name: 'Pizza Palace',
      address: '56 Duplication Road, Colombo 04',
      location: {
        lat: 6.8913,
        lng: 79.8587,
      },
    },
    customer: {
      id: 'cust-002',
      name: 'Sarah Johnson',
      phone: '071-987-6543',
    },
    dropLocation: {
      address: '123 Barnes Place, Colombo 07',
      location: {
        lat: 6.9106,
        lng: 79.8629,
      },
    },
    status: DeliveryStatus.IN_TRANSIT,
    orderStatus: OrderStatus.OUT_FOR_DELIVERY,
    isPaid: true,
    deliveryFee: 3.99,
    total: 29.97,
    createdAt: new Date('2025-04-27T15:15:00'),
    acceptedAt: new Date('2025-04-27T15:20:00'),
    deliveryPersonId: 'driver-001',
    paymentMethod: 'credit_card',
    paymentId: 'pay_65f23b19d02e789',
  },
  {
    id: 'del-003',
    orderId: 'ord-65f23c92f84a',
    orderItems: [
      {
        itemId: '662b8b43c6d3f2f5938b1d13',
        name: 'Spicy Thai Noodles',
        quantity: 2,
        price: 13.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d03',
      name: 'Asian Fusion',
      address: '78 Independence Avenue, Colombo 07',
      location: {
        lat: 6.9017,
        lng: 79.8636,
      },
    },
    customer: {
      id: 'cust-003',
      name: 'Emily Chen',
      phone: '076-567-8901',
    },
    dropLocation: {
      address: '27 Flower Road, Colombo 07',
      location: {
        lat: 6.9143,
        lng: 79.8549,
      },
    },
    status: DeliveryStatus.DELIVERED,
    orderStatus: OrderStatus.DELIVERED,
    isPaid: true,
    deliveryFee: 5.99,
    total: 33.97,
    createdAt: new Date('2025-04-26T18:45:00'),
    acceptedAt: new Date('2025-04-26T18:50:00'),
    deliveredAt: new Date('2025-04-26T19:25:00'),
    deliveryPersonId: 'driver-002',
    paymentMethod: 'digital_wallet',
    paymentId: 'pay_65f23c92f84a123',
  },
  {
    id: 'del-004',
    orderId: 'ord-65f23d10a95b',
    orderItems: [
      {
        itemId: '662b8ba0c6d3f2f5938b1d18',
        name: 'Double Bacon Burger',
        quantity: 1,
        price: 15.99,
      },
      {
        itemId: '662b8b59c6d3f2f5938b1d14',
        name: 'Caesar Salad',
        quantity: 1,
        price: 9.99,
      },
      {
        itemId: '662b8be7c6d3f2f5938b1d1c',
        name: 'Cheesecake',
        quantity: 1,
        price: 8.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d01',
      name: 'Burger Haven',
      address: '25 York Street, Fort, Colombo 01',
      location: {
        lat: 6.9321,
        lng: 79.8436,
      },
    },
    customer: {
      id: 'cust-004',
      name: 'Michael Brown',
      phone: '070-234-5678',
    },
    dropLocation: {
      address: '15 Marine Drive, Colombo 03',
      location: {
        lat: 6.8789,
        lng: 79.8573,
      },
    },
    status: DeliveryStatus.PENDING,
    orderStatus: OrderStatus.CONFIRMED,
    isPaid: false,
    deliveryFee: 6.99,
    total: 41.96,
    createdAt: new Date('2025-04-27T12:10:00'),
    paymentMethod: 'cash_on_delivery',
  },
  {
    id: 'del-005',
    orderId: 'ord-65f23e8bcb2f',
    orderItems: [
      {
        itemId: '662b8bd5c6d3f2f5938b1d1b',
        name: 'Fish and Chips',
        quantity: 1,
        price: 16.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d03',
      name: 'Asian Fusion',
      address: '78 Independence Avenue, Colombo 07',
      location: {
        lat: 6.9017,
        lng: 79.8636,
      },
    },
    customer: {
      id: 'cust-005',
      name: 'David Wilson',
      phone: '075-345-6789',
    },
    dropLocation: {
      address: '32 Horton Place, Colombo 07',
      location: {
        lat: 6.9028,
        lng: 79.8662,
      },
    },
    status: DeliveryStatus.ACCEPTED,
    orderStatus: OrderStatus.PREPARING,
    isPaid: true,
    deliveryFee: 4.49,
    total: 21.48,
    createdAt: new Date('2025-04-27T11:30:00'),
    acceptedAt: new Date('2025-04-27T11:35:00'),
    deliveryPersonId: 'driver-001',
    paymentMethod: 'credit_card',
    paymentId: 'pay_65f23e8bcb2f456',
  },
  {
    id: 'del-006',
    orderId: 'ord-65f23f27d36c',
    orderItems: [
      {
        itemId: '662b8b11c6d3f2f5938b1d11',
        name: 'Classic Cheeseburger',
        quantity: 1,
        price: 12.99,
      },
      {
        itemId: '662b8b6bc6d3f2f5938b1d15',
        name: 'Chocolate Brownie Sundae',
        quantity: 1,
        price: 7.99,
      },
    ],
    restaurant: {
      id: '662b8afcc6d3f2f5938b1d01',
      name: 'Burger Haven',
      address: '25 York Street, Fort, Colombo 01',
      location: {
        lat: 6.9321,
        lng: 79.8436,
      },
    },
    customer: {
      id: 'cust-006',
      name: 'Jennifer Lee',
      phone: '074-456-7890',
    },
    dropLocation: {
      address: '45 Ward Place, Colombo 07',
      location: {
        lat: 6.9007,
        lng: 79.8679,
      },
    },
    status: DeliveryStatus.DELIVERED,
    orderStatus: OrderStatus.DELIVERED,
    isPaid: true,
    deliveryFee: 3.49,
    total: 24.47,
    createdAt: new Date('2025-04-26T10:15:00'),
    acceptedAt: new Date('2025-04-26T10:18:00'),
    deliveredAt: new Date('2025-04-26T10:40:00'),
    deliveryPersonId: 'driver-003',
    paymentMethod: 'digital_wallet',
    paymentId: 'pay_65f23f27d36c789',
  },
];

// Pre-defined delivery routes (could be used for route optimization)
export const deliveryRoutes = [
  {
    routeId: 'route-001',
    deliveryIds: ['del-002', 'del-005'],
    optimizedOrder: ['del-002', 'del-005'],
    totalDistance: 3.2,
    estimatedDuration: 45, // minutes
  },
  {
    routeId: 'route-002',
    deliveryIds: ['del-001', 'del-004'],
    optimizedOrder: ['del-001', 'del-004'],
    totalDistance: 5.6,
    estimatedDuration: 70, // minutes
  },
];

// Current location of delivery drivers (for real-time tracking)
export const deliveryDrivers = [
  {
    driverId: 'driver-001',
    name: 'Alex Rodriguez',
    phone: '077-111-2222',
    currentLocation: {
      lat: 6.9073,
      lng: 79.8614,
    },
    status: 'online',
    currentDeliveryId: 'del-002',
    vehicle: {
      type: 'motorcycle',
      color: 'blue',
      licensePlate: 'WP-BCD-1234',
    },
    rating: 4.8,
  },
  {
    driverId: 'driver-002',
    name: 'Maria Garcia',
    phone: '071-333-4444',
    currentLocation: {
      lat: 6.9107,
      lng: 79.8559,
    },
    status: 'offline',
    vehicle: {
      type: 'car',
      color: 'silver',
      licensePlate: 'WP-CAB-5678',
    },
    rating: 4.9,
  },
  {
    driverId: 'driver-003',
    name: 'James Wilson',
    phone: '076-555-6666',
    currentLocation: {
      lat: 6.9216,
      lng: 79.8562,
    },
    status: 'online',
    vehicle: {
      type: 'bicycle',
      color: 'red',
    },
    rating: 4.7,
  },
];

// Helper functions for delivery operations
export const getDeliveryById = (id: string): DeliveryOrder | undefined => {
  return deliveryOrders.find((delivery) => delivery.id === id);
};

export const getDeliveriesByStatus = (status: DeliveryStatus): DeliveryOrder[] => {
  return deliveryOrders.filter((delivery) => delivery.status === status);
};

export const getPendingDeliveries = (): DeliveryOrder[] => {
  return getDeliveriesByStatus(DeliveryStatus.PENDING);
};

export const getActiveDeliveries = (): DeliveryOrder[] => {
  return deliveryOrders.filter(
    (delivery) =>
      delivery.status === DeliveryStatus.ACCEPTED || delivery.status === DeliveryStatus.IN_TRANSIT,
  );
};

export const getCompletedDeliveries = (): DeliveryOrder[] => {
  return getDeliveriesByStatus(DeliveryStatus.DELIVERED);
};

export const getDeliveriesByDriver = (driverId: string): DeliveryOrder[] => {
  return deliveryOrders.filter((delivery) => delivery.deliveryPersonId === driverId);
};

export const getDriverById = (driverId: string) => {
  return deliveryDrivers.find((driver) => driver.driverId === driverId);
};

export const calculateDeliveryMetrics = (driverId?: string) => {
  let filteredDeliveries = deliveryOrders;

  if (driverId) {
    filteredDeliveries = getDeliveriesByDriver(driverId);
  }

  const completed = filteredDeliveries.filter((d) => d.status === DeliveryStatus.DELIVERED);

  // Calculate average delivery time for completed deliveries
  const deliveryTimes = completed
    .filter((d) => d.deliveredAt && d.acceptedAt)
    .map((d) => {
      const acceptedTime = d.acceptedAt as Date;
      const deliveredTime = d.deliveredAt as Date;
      return (deliveredTime.getTime() - acceptedTime.getTime()) / (1000 * 60); // in minutes
    });

  const avgTime =
    deliveryTimes.length > 0
      ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
      : 0;

  // Calculate total earnings (delivery fees)
  const totalEarnings = completed.reduce((sum, d) => sum + d.deliveryFee, 0);

  return {
    totalDeliveries: filteredDeliveries.length,
    completedDeliveries: completed.length,
    averageDeliveryTime: Math.round(avgTime),
    totalEarnings: totalEarnings,
    averageRating: 4.8, // Mock value, in real app would be calculated from ratings
    onTimeRate: 94, // Mock value, in real app would be calculated from on-time deliveries
  };
};
