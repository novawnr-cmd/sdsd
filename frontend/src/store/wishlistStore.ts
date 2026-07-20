import { create } from 'zustand';
import api from '@/lib/api';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
  syncWithAPI: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  toggleWishlist: async (product: Product) => {
    const exists = get().items.some((item) => item._id === product._id);
    if (exists) {
      set({ items: get().items.filter((item) => item._id !== product._id) });
      try {
        await api.delete(`/wishlist/${product._id}`);
      } catch {
        set({ items: [...get().items, product] });
      }
    } else {
      set({ items: [...get().items, product] });
      try {
        await api.post('/wishlist', { productId: product._id });
      } catch {
        set({ items: get().items.filter((item) => item._id !== product._id) });
      }
    }
    localStorage.setItem('wishlist', JSON.stringify(get().items));
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item._id === productId);
  },

  loadWishlist: () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        set({ items: JSON.parse(saved) });
      } catch {
        set({ items: [] });
      }
    }
  },

  syncWithAPI: async () => {
    try {
      const res = await api.get('/wishlist');
      const items = res.data.data.map((item: { product: Product }) => item.product);
      set({ items });
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch {
      get().loadWishlist();
    }
  },
}));
