"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/features/orders/api/orders-service";
import { OrderPayload } from "@/features/orders/types";

const ORDERS_QUERY_KEY = ["orders"];

export function useOrders(enabled = true) {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: ordersService.list,
    enabled,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderPayload) => ordersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OrderPayload }) =>
      ordersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}
