"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { catalogProducts } from "@/features/catalog/data/products";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { CartItem, CheckoutDraft } from "@/features/cart/types";

const STORAGE_KEY_PREFIX = "elaine_confeitaria_cart";
const CHECKOUT_DRAFT_STORAGE_KEY_PREFIX = "elaine_confeitaria_checkout_draft";

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

function loadCartItems(storageKey: string) {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  const rawItems = window.localStorage.getItem(storageKey);
  if (!rawItems) {
    return [] as CartItem[];
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
}

function loadCheckoutDraft(storageKey: string) {
  if (typeof window === "undefined") {
    return defaultCheckoutDraft;
  }

  const rawDraft = window.localStorage.getItem(storageKey);
  return rawDraft
    ? { ...defaultCheckoutDraft, ...(JSON.parse(rawDraft) as Partial<CheckoutDraft>) }
    : defaultCheckoutDraft;
}

type ScopedCartProviderProps = PropsWithChildren<{
  cartStorageKey: string;
  checkoutDraftStorageKey: string;
}>;

function ScopedCartProvider({
  children,
  cartStorageKey,
  checkoutDraftStorageKey,
}: ScopedCartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartItems(cartStorageKey));
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>(() => loadCheckoutDraft(checkoutDraftStorageKey));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [cartStorageKey, items]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(checkoutDraftStorageKey, JSON.stringify(checkoutDraft));
  }, [checkoutDraft, checkoutDraftStorageKey]);

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

export function CartProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const storageScope = user?.id ? `user_${user.id}` : "guest";
  const cartStorageKey = `${STORAGE_KEY_PREFIX}_${storageScope}`;
  const checkoutDraftStorageKey = `${CHECKOUT_DRAFT_STORAGE_KEY_PREFIX}_${storageScope}`;

  return (
    <ScopedCartProvider
      key={storageScope}
      cartStorageKey={cartStorageKey}
      checkoutDraftStorageKey={checkoutDraftStorageKey}
    >
      {children}
    </ScopedCartProvider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext deve ser usado dentro de CartProvider.");
  }

  return context;
}
