"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { CatalogProduct } from "@/features/catalog/types";
import { Order } from "@/features/orders/types";
import { formatCurrency } from "@/lib/utils/format";

type OrderItemsDialogProps = {
  order: Order | null;
  products: CatalogProduct[];
  onClose: () => void;
};

function getProductById(products: CatalogProduct[], productId: number) {
  return products.find((product) => product.produtoId === productId) ?? null;
}

export function OrderItemsDialog({ order, products, onClose }: OrderItemsDialogProps) {
  return (
    <Dialog open={Boolean(order)} onClose={onClose} fullWidth maxWidth="md">
      {order ? (
        <>
          <DialogTitle>{`Itens do pedido #${order.id}`}</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2.5, pb: 1 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label={order.status} color="primary" variant="outlined" />
              <Chip label={order.tipoEntrega} variant="outlined" />
              <Chip label={`${order.itens.length} item(ns)`} />
            </Stack>

            {order.itens.map((item, index) => {
              const product = getProductById(products, item.produtoId);

              return (
                <Box
                  key={`${order.id}-${item.produtoId}-${index}`}
                  sx={{
                    display: "grid",
                    gap: 2,
                    p: 2,
                    borderRadius: "24px",
                    border: "1px solid",
                    borderColor: "divider",
                    background:
                      product?.cor ?? "linear-gradient(135deg, rgba(255,244,246,1) 0%, rgba(250,248,255,1) 100%)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: { xs: "flex-start", md: "center" },
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    {product?.imagemUrl ? (
                      <Box
                        component="img"
                        src={product.imagemUrl}
                        alt={product.imagemAlt ?? product.nome}
                        sx={{
                          width: { xs: "100%", md: 132 },
                          height: 132,
                          borderRadius: "18px",
                          objectFit: "cover",
                          display: "block",
                          flexShrink: 0,
                        }}
                      />
                    ) : null}

                    <Box sx={{ display: "grid", gap: 0.75, width: "100%" }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        <Chip label={`Produto #${item.produtoId}`} size="small" />
                        <Chip label={`${item.quantidade} un.`} size="small" variant="outlined" />
                        {product?.categoria ? <Chip label={product.categoria} size="small" variant="outlined" /> : null}
                      </Stack>
                      <Typography variant="h6">{product?.nome ?? `Produto #${item.produtoId}`}</Typography>
                      <Typography color="text.secondary">
                        {product?.descricao ?? "Detalhes do produto indisponiveis no catalogo atual."}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                        <Typography variant="body2" color="text.secondary">
                          {product?.tamanho ?? "Tamanho nao informado"}
                        </Typography>
                        {typeof product?.precoUnitario === "number" ? (
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {formatCurrency(product.precoUnitario)}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose}>Fechar</Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}
