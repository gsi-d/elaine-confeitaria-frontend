"use client";

import { Button, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useDeliveryConfiguration } from "@/features/delivery-config/hooks/use-delivery-config";
import { CatalogProduct } from "@/features/catalog/types";
import { formatCurrency, formatDeliveryEstimate } from "@/lib/utils/format";

type ProductDetailsDialogProps = {
  product: CatalogProduct | null;
  onClose: () => void;
  onAddToCart: (product: CatalogProduct) => void;
};

export function ProductDetailsDialog({
  product,
  onClose,
  onAddToCart,
}: ProductDetailsDialogProps) {
  const { data: deliveryConfiguration } = useDeliveryConfiguration();
  const deliveryEstimateLabel = formatDeliveryEstimate(
    deliveryConfiguration?.tempoMinimoMinutos,
    deliveryConfiguration?.tempoMaximoMinutos,
  );
  const displayLeadTime =
    deliveryEstimateLabel !== "Consulte disponibilidade"
      ? deliveryEstimateLabel
      : (product?.tempoEntrega ?? "Consulte disponibilidade");

  return (
    <Dialog open={Boolean(product)} onClose={onClose} fullWidth maxWidth="sm">
      {product ? (
        <>
          <DialogTitle>{product.nome}</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2.5, pb: 1 }}>
            <Box
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                background: product.cor,
              }}
            >
              {product.imagemUrl ? (
                <Box
                  component="img"
                  src={product.imagemUrl}
                  alt={product.imagemAlt ?? product.nome}
                  sx={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Box sx={{ p: 4, minHeight: 220, display: "grid", placeItems: "center" }}>
                  <Typography variant="h6">{product.nome}</Typography>
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label={product.categoria} size="small" />
              {product.tamanho ? <Chip label={product.tamanho} size="small" variant="outlined" /> : null}
              {product.destaque ? <Chip label={product.destaque} size="small" color="secondary" /> : null}
            </Stack>

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
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose}>Fechar</Button>
            <Button
              variant="contained"
              disabled={typeof product.precoUnitario !== "number"}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              {typeof product.precoUnitario === "number"
                ? "Adicionar ao carrinho"
                : "Indisponível no carrinho"}
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}
