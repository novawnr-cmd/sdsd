import { create } from 'zustand';
import api from '@/lib/api';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  couponCode: string | null;
  discount: number;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  syncWithAPI: () => Promise<void>;
  loadLocalCart: () => void;
}

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  couponCode: null,
  discount: 0,

  addToCart: (product, quantity = 1, variant) => {
    const items = [...get().items];
    const existingIndex = items.findIndex(
      (item) =>
        item.product._id === product._id &&
        item.variant?._id === variant?._id
    );
    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ product, variant, quantity });
    }
    const total = calcTotal(items);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(items));
    set({ items, total, itemCount });
  },

  removeFromCart: (productId, variantId) => {
    const items = get().items.filter(
      (item) =>
        !(item.product._id === productId && item.variant?._id === variantId)
    );
    const total = calcTotal(items);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(items));
    set({ items, total, itemCount });
  },

  updateQuantity: (productId, quantity, variantId) => {
    if (quantity < 1) return get().removeFromCart(productId, variantId);
    const items = get().items.map((item) =>
      item.product._id === productId && item.variant?._id === variantId
        ? { ...item, quantity }
        : item
    );
    const total = calcTotal(items);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(items));
    set({ items, total, itemCount });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [], total: 0, itemCount: 0, couponCode: null, discount: 0 });
  },

  applyCoupon: async (code: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/coupons/validate', { code, total: get().total });
      const { discount } = res.data.data;
      set({ couponCode: code, discount, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeCoupon: () => {
    set({ couponCode: null, discount: 0 });
  },

  syncWithAPI: async () => {
    try {
      const res = await api.get('/cart');
      const items = res.data.data.items || [];
      const total = calcTotal(items);
      const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      set({ items, total, itemCount });
    } catch {
      get().loadLocalCart();
    }
  },

  loadLocalCart: () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const items: CartItem[] = JSON.parse(saved);
        const total = calcTotal(items);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ items, total, itemCount });
      } catch {
        set({ items: [], total: 0, itemCount: 0 });
      }
    }
  },
}));
