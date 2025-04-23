import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/types/cart';
import {
  addToCart as addItemToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart as emptyCart,
  calculateCartTotal,
  getCartItemCount,
} from '@/lib/cart';

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  itemCount: number;
  addToCart: (item: MenuItem, quantity: number, customizations?: Record<string, unknown>) => void;
  removeItem: (menuItemId: string, customizations?: Record<string, unknown>) => void;
  updateQuantity: (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, unknown>,
  ) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      cartTotal: 0,
      itemCount: 0,

      addToCart: (item, quantity, customizations) => {
        const updatedCart = addItemToCart(item, quantity, customizations);
        set({
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
          itemCount: getCartItemCount(updatedCart),
          isCartOpen: true,
        });
      },

      removeItem: (menuItemId, customizations) => {
        const updatedCart = removeFromCart(menuItemId, customizations);
        set({
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
          itemCount: getCartItemCount(updatedCart),
        });
      },

      updateQuantity: (menuItemId, quantity, customizations) => {
        const updatedCart = updateCartItemQuantity(menuItemId, quantity, customizations);
        set({
          cart: updatedCart,
          cartTotal: calculateCartTotal(updatedCart),
          itemCount: getCartItemCount(updatedCart),
        });
      },

      clearCart: () => {
        const emptyCartItems = emptyCart();
        set({
          cart: emptyCartItems,
          cartTotal: 0,
          itemCount: 0,
        });
      },

      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'cart-storage',
    },
  ),
);
