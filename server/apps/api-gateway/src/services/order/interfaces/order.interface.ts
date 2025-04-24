// src/interfaces/order-contracts.ts

export interface CreateOrderInput {
  customerId?: string;
  suborders: {
    restaurantId: string;
    items: {
      menuItemId: string;
      name: string;
      price: number;
      quantity: number;
      customizations?: Record<string, any>;
    }[];
    status?: string;
  }[];
  deliveryFee: number;
  tax: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };
  paymentMethod?: string;
  specialInstructions?: string;
}

export interface UpdateOrderInput {
  deliveryFee?: number;
  tax?: number;
  paymentMethod?: string;
  deliveryAddress?: CreateOrderInput['deliveryAddress'];
  specialInstructions?: string;
}

export interface UpdateSuborderStatusInput {
  status: string;
}

export interface OrderOutput {
  _id: string;
  customerId: string;
  total: number;
  // add more fields as needed
}
