"use client";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { OrderItemsDialog } from "@/features/orders/components/order-items-dialog";
import { useGuestOrders } from "@/features/orders/hooks/use-guest-orders";
import { filterOrdersForViewer } from "@/features/orders/ownership";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { Order } from "@/features/orders/types";
import { formatDeliveryTypeLabel, formatStatusLabel } from "@/lib/utils/format";

function getScheduleLabel(order: Order): string {
  return order.melhorHorarioEntrega ?? order.horarioEntrega ?? order.horarioRetirada ?? "Não informado";
}

function getRecipientLabel(order: Order): string {
  if (order.nomeRecebedor) {
    return order.nomeRecebedor;
  }

  if (order.tipoEntrega === "RETIRADA") {
    return "Retirada no local";
  }

  return "Entrega sem recebedor";
}

export default function MyOrdersPage() {
  const { isAdmin, isAuthenticated, user } = useAuth();
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const { data = [], isLoading, isError } = useOrders(isAuthenticated);
  const { orders: guestOrders } = useGuestOrders();
  const { data: products = [] } = useProducts();
  const currentOrderId = useMemo(() => {
    const params = new URLSearchParams(search);
    const current = Number(params.get("current"));
    return Number.isFinite(current) ? current : null;
  }, [search]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const productNamesById = useMemo(
    () => new Map(products.map((product) => [product.produtoId, product.nome] as const)),
    [products],
  );
  const orders = useMemo(() => {
    const sourceOrders = isAuthenticated ? filterOrdersForViewer(data, user, isAdmin) : guestOrders;
    return [...sourceOrders].sort((left, right) => right.id - left.id);
  }, [data, guestOrders, isAdmin, isAuthenticated, user]);
  const shouldShowLoading = isAuthenticated && isLoading;
  const shouldShowError = isAuthenticated && isError;

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
          <Typography variant="h4">Meus pedidos</Typography>
          <Chip icon={<ReceiptLongRoundedIcon />} label={`${orders.length} pedidos encontrados`} />
        </Stack>
        <Typography color="text.secondary">
          Acompanhe seu pedido atual e consulte também os pedidos anteriores.
        </Typography>
      </Box>

      {shouldShowLoading ? (
        <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : shouldShowError ? (
        <Alert severity="error">Não foi possível carregar seus pedidos.</Alert>
      ) : orders.length === 0 ? (
        <Alert severity="info">Você ainda não possui pedidos cadastrados.</Alert>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => {
            const isCurrent = currentOrderId !== null && order.id === currentOrderId;

            return (
              <Grid key={order.id} size={{ xs: 12, lg: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    border: isCurrent ? "2px solid" : "1px solid",
                    borderColor: isCurrent ? "primary.main" : "divider",
                    boxShadow: isCurrent ? "0 16px 36px rgba(216,111,157,0.16)" : undefined,
                  }}
                >
                  <CardContent sx={{ display: "grid", gap: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        <Chip label={`Pedido #${order.id}`} color={isCurrent ? "primary" : "default"} />
                        <Chip label={formatDeliveryTypeLabel(order.tipoEntrega)} variant="outlined" />
                        {isCurrent ? <Chip label="Pedido atual" color="secondary" /> : null}
                      </Stack>
                      <Chip label={formatStatusLabel(order.status)} color="primary" variant="outlined" />
                    </Stack>

                    <Box sx={{ display: "grid", gap: 0.75 }}>
                      <Typography variant="h6">{getRecipientLabel(order)}</Typography>
                      <Typography color="text.secondary">
                        {order.endereco ?? "Endereço não informado"}
                      </Typography>
                    </Box>

                    <Divider />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Agendamento
                        </Typography>
                        <Typography>{getScheduleLabel(order)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Itens
                        </Typography>
                        <Typography>{order.itens.length} item(ns)</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Desconto
                        </Typography>
                        <Typography>{order.desconto}%</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Observações
                        </Typography>
                        <Typography>{order.observacoes || "Sem observações"}</Typography>
                      </Grid>
                    </Grid>

                    <Divider />

                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="subtitle2">Resumo dos itens</Typography>
                      {order.itens.map((item, index) => (
                        <Box
                          key={`${order.id}-${item.produtoId}-${index}`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            p: 1.25,
                            borderRadius: "16px",
                            bgcolor: "rgba(216,111,157,0.06)",
                          }}
                        >
                          <Typography>{productNamesById.get(item.produtoId) ?? `Produto #${item.produtoId}`}</Typography>
                          <Typography>{item.quantidade} un.</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityRoundedIcon />}
                      sx={{ width: "fit-content" }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver detalhes dos itens
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <OrderItemsDialog
        order={selectedOrder}
        products={products}
        onClose={() => setSelectedOrder(null)}
      />
    </Box>
  );
}
