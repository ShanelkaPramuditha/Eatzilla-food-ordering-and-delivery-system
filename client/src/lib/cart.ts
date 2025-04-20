import { CartItem, MenuItem } from "@/types";

// Save cart to localStorage
export const saveCart = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('food-ordering-cart', JSON.stringify(cart));
  }
};

// Load cart from localStorage
export const loadCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('food-ordering-cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// Add item to cart
export const addToCart = (item: MenuItem, quantity: number = 1, customizations?: Record<string, any>): CartItem[] => {
  const cart = loadCart();
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.menuItemId === item.id && 
    JSON.stringify(cartItem.customizations || {}) === JSON.stringify(customizations || {})
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      customizations,
      image: item.image,
    });
  }
  
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (menuItemId: string, customizations?: Record<string, any>): CartItem[] => {
  const cart = loadCart();
  const updatedCart = cart.filter(
    item => !(item.menuItemId === menuItemId && 
    JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {}))
  );
  
  saveCart(updatedCart);
  return updatedCart;
};

// Update item quantity
export const updateCartItemQuantity = (
  menuItemId: string, 
  quantity: number, 
  customizations?: Record<string, any>
): CartItem[] => {
  const cart = loadCart();
  
  const itemIndex = cart.findIndex(
    item => item.menuItemId === menuItemId && 
    JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {})
  );
  
  if (itemIndex >= 0) {
    if (quantity > 0) {
      cart[itemIndex].quantity = quantity;
    } else {
      // Remove item if quantity is 0 or negative
      cart.splice(itemIndex, 1);
    }
  }
  
  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = (): CartItem[] => {
  saveCart([]);
  return [];
};

// Calculate cart total
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get cart item count
export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};