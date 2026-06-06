"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { catalogProducts } from "@/features/catalog/data/products";
import { CartItem, CheckoutDraft } from "@/features/cart/types";

const STORAGE_KEY = "elaine_confeitaria_cart";
const CHECKOUT_DRAFT_STORAGE_KEY = "elaine_confeitaria_checkout_draft";

const defaultCheckoutDraft: CheckoutDraft = {
  tipoEntrega: "ENTREGA",
  nomeRecebedor: "",
  endereco: "",
  complemento: "",
  referencia: "",
  horarioEntrega: "",
  horarioRetirada: "",
  observacoes: "",
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkoutDraft: CheckoutDraft;
  updateCheckoutDraft: (draft: Partial<CheckoutDraft>) => void;
  resetCheckoutDraft: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const rawItems = window.localStorage.getItem(STORAGE_KEY);
    if (!rawItems) {
      return [];
    }

    return (JSON.parse(rawItems) as Array<Partial<CartItem>>).flatMap((item) => {
      const matchedProduct = catalogProducts.find((product) => product.id === item.id);

      if (!item.id || !item.nome || !item.precoUnitario || !item.quantidade) {
        return [];
      }

      const produtoId = item.produtoId ?? matchedProduct?.produtoId;

      if (!produtoId) {
        return [];
      }

      return [
        {
          id: item.id,
          produtoId,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        },
      ];
    });
  });
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>(() => {
    if (typeof window === "undefined") {
      return defaultCheckoutDraft;
    }

    const rawDraft = window.localStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
    return rawDraft
      ? { ...defaultCheckoutDraft, ...(JSON.parse(rawDraft) as Partial<CheckoutDraft>) }
      : defaultCheckoutDraft;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(checkoutDraft));
  }, [checkoutDraft]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      checkoutDraft,
      addItem(item) {
        setItems((currentItems) => {
          const existing = currentItems.find((currentItem) => currentItem.id === item.id);

          if (existing) {
            return currentItems.map((currentItem) =>
              currentItem.id === item.id
                ? {
                    ...currentItem,
                    quantidade: currentItem.quantidade + item.quantidade,
                  }
                : currentItem,
            );
          }

          return [...currentItems, item];
        });
      },
      updateQuantity(id, quantidade) {
        setItems((currentItems) => {
          if (quantidade <= 0) {
            return currentItems.filter((item) => item.id !== id);
          }

          return currentItems.map((item) => (item.id === id ? { ...item, quantidade } : item));
        });
      },
      removeItem(id) {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      },
      clearCart() {
        setItems([]);
      },
      updateCheckoutDraft(draft) {
        setCheckoutDraft((currentDraft) => ({ ...currentDraft, ...draft }));
      },
      resetCheckoutDraft() {
        setCheckoutDraft(defaultCheckoutDraft);
      },
      total: items.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0),
    }),
    [checkoutDraft, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext deve ser usado dentro de CartProvider.");
  }

  return context;
}
