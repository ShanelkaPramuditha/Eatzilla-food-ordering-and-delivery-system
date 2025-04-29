import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/types/cart';

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  itemCount: number;
  deliveryFee: number;
  addToCart: (item: any, quantity: number, customizations?: Record<string, unknown>) => void;
  removeItem: (menuItemId: string, customizations?: Record<string, unknown>) => void;
  updateQuantity: (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, unknown>,
  ) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Helper functions used internally by the store
const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      cartTotal: 0,
      itemCount: 0,
      deliveryFee: 0,

      addToCart: (item, quantity = 1, customizations) => {
        const currentCart = [...get().cart];

        // Check if item already exists in cart
        const existingItemIndex = currentCart.findIndex(
          (cartItem) =>
            cartItem.menuItemId === item._id &&
            JSON.stringify(cartItem.customizations || {}) === JSON.stringify(customizations || {}),
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          currentCart.push({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity,
            customizations,
            image: item.image,
            restaurantId: item.restaurant || 'default-restaurant',
          });
        }

        set({
          cart: currentCart,
          cartTotal: calculateCartTotal(currentCart),
          itemCount: getCartItemCount(currentCart),
          isCartOpen: true,
          deliveryFee: 100,
        });
      },

      removeItem: (menuItemId, customizations) => {
        const currentCart = get().cart;
        const updatedCart = currentCart.filter(
          (item) =>
            !(
              item.menuItemId === menuItemId &&
              JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {})
            ),
        );

        set({
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
          itemCount: getCartItemCount(updatedCart),
          deliveryFee: 100,
        });
      },

      updateQuantity: (menuItemId, quantity, customizations) => {
        const currentCart = [...get().cart];
        const itemIndex = currentCart.findIndex(
          (item) =>
            item.menuItemId === menuItemId &&
            JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {}),
        );

        if (itemIndex >= 0) {
          if (quantity > 0) {
            currentCart[itemIndex].quantity = quantity;
          } else {
            // Remove item if quantity is 0 or negative
            currentCart.splice(itemIndex, 1);
          }
        }

        set({
          cart: currentCart,
          cartTotal: calculateCartTotal(currentCart),
          itemCount: getCartItemCount(currentCart),
        });
      },

      clearCart: () => {
        set({
          cart: [],
          cartTotal: 0,
          itemCount: 0,
          deliveryFee: 0,
          isCartOpen: false,
        });
      },

      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'cart-storage', // This is the key used by persist middleware for localStorage
    },
  ),
);
