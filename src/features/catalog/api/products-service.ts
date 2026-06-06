import { httpClient } from "@/lib/http/http-client";
import { CatalogProduct, mapApiProduct } from "@/features/catalog/types";

function normalizeProductsResponse(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const preferredKeys = ["data", "items", "produtos", "content", "results", "rows"];

    for (const key of preferredKeys) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }

    for (const value of Object.values(record)) {
      const normalized = normalizeProductsResponse(value);
      if (normalized.length > 0) {
        return normalized;
      }
    }
  }

  return [];
}

export const productsService = {
  async list(): Promise<CatalogProduct[]> {
    const { data } = await httpClient.get<unknown>("/produtos");

    return normalizeProductsResponse(data)
      .map((product, index) => mapApiProduct(product, index))
      .filter((product): product is CatalogProduct => product !== null);
  },
};
