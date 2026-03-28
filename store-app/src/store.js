import { create } from "zustand";

export const useCartStore = create((set) => ({
  cartItems: [],
  
  addToCart: (product) => set((state) => {
    const existing = state.cartItems.find(i => i.id === product.id);
    if (existing) {
      return { cartItems: state.cartItems.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(i => i.id !== id)
  })),

  increaseQuantity: (id) => set((state) => ({
    cartItems: state.cartItems.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
  })),

  decreaseQuantity: (id) => set((state) => ({
    cartItems: state.cartItems.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)
  })),

  clearCart: () => set({ cartItems: [] })
}));
