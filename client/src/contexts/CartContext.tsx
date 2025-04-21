'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types/cart';
import {
  loadCart,
  saveCart,
  addToCart as addItemToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart as emptyCart,
  calculateCartTotal,
  getCartItemCount,
} from '@/lib/cart';

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, customizations?: Record<string, unknown>) => void;
  removeItem: (menuItemId: string, customizations?: Record<string, unknown>) => void;
  updateQuantity: (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, unknown>,
  ) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage on component mount
  useEffect(() => {
    const loadedCart = loadCart();
    setCart(loadedCart);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCart(cart);
    }
  }, [cart, isInitialized]);

  const addToCart = (item: MenuItem, quantity: number, customizations?: Record<string, unknown>) => {
    const updatedCart = addItemToCart(item, quantity, customizations);
    setCart(updatedCart);
    setIsCartOpen(true); // Open cart drawer when item is added
  };

  const removeItem = (menuItemId: string, customizations?: Record<string, unknown>) => {
    const updatedCart = removeFromCart(menuItemId, customizations);
    setCart(updatedCart);
  };

  const updateQuantity = (
    menuItemId: string,
    quantity: number,
    customizations?: Record<string, unknown>,
  ) => {
    const updatedCart = updateCartItemQuantity(menuItemId, quantity, customizations);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const emptyCartItems = emptyCart();
    setCart(emptyCartItems);
  };

  const cartTotal = calculateCartTotal(cart);
  const itemCount = getCartItemCount(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
