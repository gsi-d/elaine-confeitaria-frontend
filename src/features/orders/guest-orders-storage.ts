"use client";

import { Order } from "@/features/orders/types";

const GUEST_ORDERS_STORAGE_KEY = "elaine_confeitaria_guest_orders";
const GUEST_ORDERS_EVENT = "elaine-guest-orders-change";
const EMPTY_GUEST_ORDERS: Order[] = [];

let cachedRawGuestOrders: string | null = null;
let cachedGuestOrders: Order[] = EMPTY_GUEST_ORDERS;

function readGuestOrdersSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_GUEST_ORDERS;
  }

  const raw = window.localStorage.getItem(GUEST_ORDERS_STORAGE_KEY);

  if (raw === cachedRawGuestOrders) {
    return cachedGuestOrders;
  }

  cachedRawGuestOrders = raw;

  if (!raw) {
    cachedGuestOrders = EMPTY_GUEST_ORDERS;
    return cachedGuestOrders;
  }

  try {
    cachedGuestOrders = JSON.parse(raw) as Order[];
  } catch {
    cachedGuestOrders = EMPTY_GUEST_ORDERS;
  }

  return cachedGuestOrders;
}

function notifyGuestOrdersChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(GUEST_ORDERS_EVENT));
}

export const guestOrdersStorage = {
  get() {
    return readGuestOrdersSnapshot();
  },

  add(order: Order) {
    if (typeof window === "undefined") {
      return;
    }

    const current = readGuestOrdersSnapshot();
    const next = [order, ...current.filter((item) => item.id !== order.id)];
    const rawNext = JSON.stringify(next);
    window.localStorage.setItem(GUEST_ORDERS_STORAGE_KEY, rawNext);
    cachedRawGuestOrders = rawNext;
    cachedGuestOrders = next;
    notifyGuestOrdersChanged();
  },

  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(GUEST_ORDERS_STORAGE_KEY);
    cachedRawGuestOrders = null;
    cachedGuestOrders = EMPTY_GUEST_ORDERS;
    notifyGuestOrdersChanged();
  },

  subscribe(onChange: () => void) {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handler = () => onChange();
    window.addEventListener("storage", handler);
    window.addEventListener(GUEST_ORDERS_EVENT, handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(GUEST_ORDERS_EVENT, handler);
    };
  },
};
