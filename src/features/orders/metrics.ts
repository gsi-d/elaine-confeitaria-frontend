import { Order } from "@/features/orders/types";

const CLOSED_STATUSES = new Set(["FINALIZADO", "CANCELADO", "ENTREGUE"]);

export function isActiveOrder(order: Order): boolean {
  return !CLOSED_STATUSES.has(order.status);
}

export function countActiveOrders(orders: Order[]): number {
  return orders.filter(isActiveOrder).length;
}
