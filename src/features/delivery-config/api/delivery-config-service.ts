import { httpClient } from "@/lib/http/http-client";
import { DeliveryConfiguration, DeliveryConfigurationPayload } from "@/features/delivery-config/types";

export const deliveryConfigService = {
  async get() {
    const { data } = await httpClient.get<DeliveryConfiguration>("/configuracao-entrega");
    return data;
  },

  async update(payload: DeliveryConfigurationPayload) {
    const { data } = await httpClient.put<DeliveryConfiguration>("/configuracao-entrega", payload);
    return data;
  },
};
