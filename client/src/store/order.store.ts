import { create } from 'zustand';

export interface OrderStore {
  customerId: string;
  deliveryAddress: {
    city: string;
    state: string;
    street: string;
    postalCode: number | string;
    instructions: string;
  };
  paymentMethod: 'cash' | 'card';
  specialInstructions: string;
  subOrders: {
    items: {
      menuItemId: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    restaurantId: string;
  }[];
  setOrder: (orderData: Partial<OrderStore>) => void;
  resetOrder: () => void;
}

export const useOrderStore = create<OrderStore>()((set) => ({
  customerId: '',
  deliveryAddress: {
    city: '',
    state: '',
    street: '',
    postalCode: '',
    instructions: '',
  },
  paymentMethod: 'cash',
  specialInstructions: '',
  subOrders: [],
  setOrder: (orderData) => set((state) => ({ ...state, ...orderData })),
  resetOrder: () =>
    set({
      customerId: '',
      deliveryAddress: {
        city: '',
        state: '',
        street: '',
        postalCode: '',
        instructions: '',
      },
      paymentMethod: 'cash',
      specialInstructions: '',
      subOrders: [],
    }),
}));
