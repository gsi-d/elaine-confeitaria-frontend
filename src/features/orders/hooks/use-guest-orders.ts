"use client";

import { useMemo, useSyncExternalStore } from "react";
import { guestOrdersStorage } from "@/features/orders/guest-orders-storage";
import { Order } from "@/features/orders/types";

const EMPTY_GUEST_ORDERS: Order[] = [];

export function useGuestOrders() {
  const guestOrders = useSyncExternalStore(
    guestOrdersStorage.subscribe,
    guestOrdersStorage.get,
    () => EMPTY_GUEST_ORDERS,
  );

  return useMemo(
    () => ({
      orders: guestOrders,
      hasGuestOrders: guestOrders.length > 0,
    }),
    [guestOrders],
  );
}
