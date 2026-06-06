"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/features/catalog/api/products-service";

const PRODUCTS_QUERY_KEY = ["products"];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productsService.list,
  });
}
