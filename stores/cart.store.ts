import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";

type CartStore = {
  // ── STATE ──
  items: CartItem[]; // liste des articles
  isOpen: boolean; // drawer ouvert ou fermé

  // ── ACTIONS ──
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // ── COMPUTED ──
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ── STATE initial ──
      items: [],
      isOpen: false,

      // ── ACTIONS ──

      // Ajouter un article
      addItem: (item) =>
        set((state) => {
          // Vérifier si le variant existe déjà dans le panier
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );

          if (existing) {
            // ← Si oui → on augmente juste la quantité
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          // ← Si non → on ajoute le nouvel article
          return { items: [...state.items, item] };
        }),

      // Supprimer un article
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      // Modifier la quantité
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        })),

      // Vider le panier
      clearCart: () => set({ items: [] }),

      // Ouvrir/fermer le drawer
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ── COMPUTED ──

      // Nombre total d'articles
      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      // Prix total
      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage", // ← clé dans localStorage
    },
  ),
);
