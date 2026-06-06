import { useCartContext } from "@/features/cart/context/cart-context";

export function useCart() {
  return useCartContext();
}

