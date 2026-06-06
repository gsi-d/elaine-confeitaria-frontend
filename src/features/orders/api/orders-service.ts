import { httpClient } from "@/lib/http/http-client";
import { Order, OrderPayload } from "@/features/orders/types";

function normalizeOrdersResponse(data: unknown): Order[] {
  if (Array.isArray(data)) {
    return data as Order[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as Order[];
    }

    if (Array.isArray(record.items)) {
      return record.items as Order[];
    }

    if (Array.isArray(record.pedidos)) {
      return record.pedidos as Order[];
    }
  }

  return [];
}

export const ordersService = {
  async list() {
    const { data } = await httpClient.get<unknown>("/pedidos");
    return normalizeOrdersResponse(data);
  },
  async create(payload: OrderPayload) {
    const { data } = await httpClient.post<Order>("/pedidos", payload);
    return data;
  },
  async update(id: number, payload: OrderPayload) {
    const { data } = await httpClient.put<Order>(`/pedidos/${id}`, payload);
    return data;
  },
  async remove(id: number) {
    await httpClient.delete(`/pedidos/${id}`);
  },
};
