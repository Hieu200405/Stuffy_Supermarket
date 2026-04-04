import { create } from "zustand";
import { cartApi } from "./api";

const syncToServer = async (cartItems) => {
  try {
    await cartApi.syncCart(cartItems);
  } catch (e) {
    console.error("Failed to sync cart", e);
  }
};

export const useCartStore = create((set, get) => ({
  cartItems: [],
  
  loadCartFromServer: async () => {
    try {
      const data = await cartApi.getCart();
      set({ cartItems: data });
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  },

  addToCart: (product) => set((state) => {
    const existing = state.cartItems.find(i => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = state.cartItems.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newItems = [...state.cartItems, { ...product, quantity: 1 }];
    }
    syncToServer(newItems);
    return { cartItems: newItems };
  }),

  removeFromCart: (id) => set((state) => {
    const newItems = state.cartItems.filter(i => i.id !== id);
    syncToServer(newItems);
    return { cartItems: newItems };
  }),

  increaseQuantity: (id) => set((state) => {
    const newItems = state.cartItems.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
    syncToServer(newItems);
    return { cartItems: newItems };
  }),

  decreaseQuantity: (id) => set((state) => {
    const newItems = state.cartItems.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i);
    syncToServer(newItems);
    return { cartItems: newItems };
  }),

  clearCart: () => set((state) => {
    syncToServer([]);
    return { cartItems: [] };
  })
}));

export const useWishlistStore = create((set) => ({
  wishlist: JSON.parse(localStorage.getItem('stuffy_wishlist')) || [],
  
  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.find(i => i.id === product.id);
    let newList;
    if (exists) {
      newList = state.wishlist.filter(i => i.id !== product.id);
    } else {
      newList = [...state.wishlist, product];
    }
    localStorage.setItem('stuffy_wishlist', JSON.stringify(newList));
    return { wishlist: newList };
  }),

  isInWishlist: (id) => false // We let components read from state.wishlist array
}));
