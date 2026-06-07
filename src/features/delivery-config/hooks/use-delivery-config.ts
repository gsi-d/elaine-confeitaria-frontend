"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryConfigService } from "@/features/delivery-config/api/delivery-config-service";
import { DeliveryConfigurationPayload } from "@/features/delivery-config/types";

export const DELIVERY_CONFIG_QUERY_KEY = ["delivery-config"];

export function useDeliveryConfiguration() {
  return useQuery({
    queryKey: DELIVERY_CONFIG_QUERY_KEY,
    queryFn: deliveryConfigService.get,
  });
}

export function useUpdateDeliveryConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeliveryConfigurationPayload) => deliveryConfigService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DELIVERY_CONFIG_QUERY_KEY });
    },
  });
}
