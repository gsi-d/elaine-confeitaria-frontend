"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { useOrders, useUpdateOrderStatus } from "@/features/orders/hooks/use-orders";
import { isActiveOrder } from "@/features/orders/metrics";
import { Order } from "@/features/orders/types";
import { formatDeliveryTypeLabel, formatStatusLabel } from "@/lib/utils/format";

const statusOptions = [
  "EM_ABERTO",
  "EM_PREPARO",
  "SAIU_PARA_ENTREGA",
  "PRONTO_PARA_RETIRADA",
  "FINALIZADO",
  "CANCELADO",
];

function parseTimeToMinutes(value?: string): number | null {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function getScheduleLabel(order: Order): string {
  return order.melhorHorarioEntrega ?? order.horarioEntrega ?? order.horarioRetirada ?? "Sem horário";
}

function getUrgency(order: Order, nowInMinutes: number) {
  const scheduled = parseTimeToMinutes(order.melhorHorarioEntrega ?? order.horarioEntrega ?? order.horarioRetirada);

  if (scheduled === null) {
    return {
      key: "sem_horario",
      label: "Sem horário",
      color: "default" as const,
      icon: <AccessTimeRoundedIcon fontSize="small" />,
    };
  }

  const diff = scheduled - nowInMinutes;

  if (diff < 0) {
    return {
      key: "atrasado",
      label: `Atrasado ${Math.abs(diff)} min`,
      color: "error" as const,
      icon: <WarningAmberRoundedIcon fontSize="small" />,
    };
  }

  if (diff <= 15) {
    return {
      key: "quase_atrasado",
      label: `Faltam ${diff} min`,
      color: "warning" as const,
      icon: <AccessTimeRoundedIcon fontSize="small" />,
    };
  }

  return {
    key: "no_prazo",
    label: `No prazo ${diff} min`,
    color: "success" as const,
    icon: <CheckCircleRoundedIcon fontSize="small" />,
  };
}

export default function OperationsPage() {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { data: orders = [], isLoading, isError } = useOrders();
  const { data: products = [] } = useProducts();
  const updateOrderStatus = useUpdateOrderStatus();
  const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});
  const nowInMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.produtoId, product.nome] as const)),
    [products],
  );
  const activeOrders = useMemo(
    () =>
      orders
        .filter(isActiveOrder)
        .sort((left, right) => {
          const leftSchedule =
            parseTimeToMinutes(left.melhorHorarioEntrega ?? left.horarioEntrega ?? left.horarioRetirada) ??
            Number.MAX_SAFE_INTEGER;
          const rightSchedule =
            parseTimeToMinutes(right.melhorHorarioEntrega ?? right.horarioEntrega ?? right.horarioRetirada) ??
            Number.MAX_SAFE_INTEGER;

          return leftSchedule - rightSchedule;
        }),
    [orders],
  );

  async function handleStatusUpdate(order: Order) {
    const nextStatus = statusDrafts[order.id] ?? order.status;

    try {
      await updateOrderStatus.mutateAsync({
        id: order.id,
        status: nextStatus,
      });

      enqueueSnackbar("Status do pedido atualizado.", { variant: "success" });
    } catch {
      enqueueSnackbar("Não foi possível atualizar o status do pedido.", { variant: "error" });
    }
  }

  if (!hasMounted) {
    return (
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Typography variant="h4">Acompanhamento</Typography>
          <Typography color="text.secondary">Carregando acompanhamento...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
          <Typography variant="h4">Acompanhamento</Typography>
          <Chip icon={<LocalShippingRoundedIcon />} label={`${activeOrders.length} pedidos em aberto`} />
        </Stack>
        <Typography color="text.secondary">
          Visualize os pedidos em andamento e priorize os mais urgentes.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Não foi possível carregar os pedidos em andamento.</Alert>
      ) : activeOrders.length === 0 ? (
        <Alert severity="success">Nenhum pedido pendente no momento.</Alert>
      ) : (
        <Grid container spacing={3}>
          {activeOrders.map((order) => {
            const urgency = getUrgency(order, nowInMinutes);

            return (
              <Grid key={order.id} size={{ xs: 12, xl: 6 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ display: "grid", gap: 2.25 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        <Chip label={`Pedido #${order.id}`} />
                        <Chip label={formatDeliveryTypeLabel(order.tipoEntrega)} variant="outlined" />
                      </Stack>
                      <Chip
                        icon={urgency.icon}
                        label={urgency.label}
                        color={urgency.color}
                        variant={urgency.color === "default" ? "outlined" : "filled"}
                      />
                    </Stack>

                    <Box sx={{ display: "grid", gap: 0.5 }}>
                      <Typography variant="h6">{order.nomeRecebedor || "Recebedor não informado"}</Typography>
                      <Typography color="text.secondary">
                        {order.endereco || "Endereço não informado"}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Horário
                        </Typography>
                        <Typography>{getScheduleLabel(order)}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Status atual
                        </Typography>
                        <Typography>{formatStatusLabel(order.status)}</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="subtitle2">Itens</Typography>
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
                          <Typography>{productsById.get(item.produtoId) ?? `Produto #${item.produtoId}`}</Typography>
                          <Typography>{item.quantidade} un.</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextField
                        select
                        label="Novo status"
                        value={statusDrafts[order.id] ?? order.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [order.id]: event.target.value,
                          }))
                        }
                        sx={{ minWidth: 220 }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {formatStatusLabel(status)}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        variant="contained"
                        onClick={() => handleStatusUpdate(order)}
                        disabled={updateOrderStatus.isPending}
                      >
                        Atualizar status
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
