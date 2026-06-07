"use client";

import { Button, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useDeliveryConfiguration } from "@/features/delivery-config/hooks/use-delivery-config";
import { CatalogProduct } from "@/features/catalog/types";
import { formatCurrency, formatDeliveryEstimate } from "@/lib/utils/format";

type ProductCardProps = {
  product: CatalogProduct;
  onOpenDetails: (product: CatalogProduct) => void;
  onAddToCart: (product: CatalogProduct) => void;
};

export function ProductCard({ product, onOpenDetails, onAddToCart }: ProductCardProps) {
  const { data: deliveryConfiguration } = useDeliveryConfiguration();
  const deliveryEstimateLabel = formatDeliveryEstimate(
    deliveryConfiguration?.tempoMinimoMinutos,
    deliveryConfiguration?.tempoMaximoMinutos,
  );
  const displayLeadTime =
    deliveryEstimateLabel !== "Consulte disponibilidade" ? deliveryEstimateLabel : product.tempoEntrega;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ display: "grid", gap: 2.25, height: "100%" }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={() => onOpenDetails(product)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenDetails(product);
            }
          }}
          sx={{
            display: "grid",
            gap: 2.25,
            cursor: "pointer",
            borderRadius: "26px",
            outline: "none",
            "&:focus-visible": {
              boxShadow: "0 0 0 3px rgba(216,111,157,0.28)",
            },
          }}
        >
          <Box
            sx={{
              minHeight: 172,
              borderRadius: "26px",
              background: product.cor,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {product.imagemUrl ? (
              <Box
                component="img"
                src={product.imagemUrl}
                alt={product.imagemAlt ?? product.nome}
                sx={{
                  width: "100%",
                  height: 172,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : null}
            <Box sx={{ p: 2.5, display: "grid", gap: 2 }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                <Chip label={product.categoria} size="small" />
                {product.destaque ? (
                  <Chip label={product.destaque} size="small" color="secondary" variant="filled" />
                ) : null}
              </Stack>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1.15 }}>
                  {product.nome}
                </Typography>
                <Typography color="text.secondary">{product.tamanho ?? displayLeadTime}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography color="text.secondary">{product.descricao}</Typography>
            <Typography variant="h5">
              {typeof product.precoUnitario === "number"
                ? formatCurrency(product.precoUnitario)
                : "Preço sob consulta"}
            </Typography>
            {displayLeadTime !== "Consulte disponibilidade" ? (
              <Typography variant="body2" color="text.secondary">
                Entrega estimada: {displayLeadTime}
              </Typography>
            ) : null}
          </Box>
        </Box>
        <Button
          variant="contained"
          disabled={typeof product.precoUnitario !== "number"}
          onClick={() => onAddToCart(product)}
        >
          {typeof product.precoUnitario === "number" ? "Adicionar ao carrinho" : "Indisponível no carrinho"}
        </Button>
      </CardContent>
    </Card>
  );
}
