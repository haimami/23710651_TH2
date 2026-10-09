import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  calculatedPrice: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingFee: number | null;
  distanceKm: number | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  setShippingInfo: (fee: number | null, km: number | null) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

// Fallback an toàn cho AsyncStorage
const safeStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: null,
      distanceKm: null,

      addItem: (product: Product, quantity = 1) => {
        const calculatedPrice = Math.round(product.price * PRICE_MULTIPLIER);
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === product.id);
          if (existingIndex > -1) {
            const nextItems = [...state.items];
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity: nextItems[existingIndex].quantity + quantity,
            };
            return { items: nextItems };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                calculatedPrice,
                image: product.image,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (id: number) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      changeQty: (id: number, delta: number) => {
        set((state) => {
          const nextItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: nextItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setShippingInfo: (fee: number | null, km: number | null) => {
        set({ shippingFee: fee, distanceKm: km });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce(
          (sum, item) => sum + item.calculatedPrice * item.quantity,
          0,
        );
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        items: state.items,
        shippingFee: state.shippingFee,
        distanceKm: state.distanceKm,
      }),
    },
  ),
);

export default useCartStore;
