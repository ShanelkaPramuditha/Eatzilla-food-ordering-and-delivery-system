// File: lib/cart.ts
// Export functions that use the store
import { useCartStore } from '@/store/cart.store';
import { MenuItem } from '@/types/cart';

// These functions are just wrappers around the store methods for compatibility
export const addToCart = (
  item: MenuItem,
  quantity: number = 1,
  customizations?: Record<string, unknown>,
) => {
  const { addToCart: addItemToCart } = useCartStore.getState();
  addItemToCart(item, quantity, customizations);
  return useCartStore.getState().cart;
};

export const removeFromCart = (menuItemId: string, customizations?: Record<string, unknown>) => {
  const { removeItem } = useCartStore.getState();
  removeItem(menuItemId, customizations);
  return useCartStore.getState().cart;
};

export const updateCartItemQuantity = (
  menuItemId: string,
  quantity: number,
  customizations?: Record<string, unknown>,
) => {
  const { updateQuantity } = useCartStore.getState();
  updateQuantity(menuItemId, quantity, customizations);
  return useCartStore.getState().cart;
};

export const clearCart = () => {
  const { clearCart: emptyCarts } = useCartStore.getState();
  emptyCarts();
  return useCartStore.getState().cart;
};

export const calculateCartTotal = () => {
  return useCartStore.getState().cartTotal;
};

export const getCartItemCount = () => {
  return useCartStore.getState().itemCount;
};

// No need for these functions anymore as Zustand's persist handles storage
// export const saveCart = () => {}; // Not needed
// export const loadCart
