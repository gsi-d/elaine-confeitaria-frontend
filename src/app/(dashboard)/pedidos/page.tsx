"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { OrderFormDialog } from "@/features/orders/components/order-form-dialog";
import {
  useCreateOrder,
  useDeleteOrder,
  useOrders,
  useUpdateOrder,
} from "@/features/orders/hooks/use-orders";
import { OrderFormValues } from "@/features/orders/schemas/order-schema";
import { Order, OrderPayload } from "@/features/orders/types";

const columns: GridColDef<Order>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "nomeRecebedor",
    headerName: "Recebedor",
    width: 180,
    valueGetter: (_value, row) => row.nomeRecebedor || "-",
  },
  { field: "endereco", headerName: "Endereco", flex: 1, minWidth: 220 },
  { field: "tipoEntrega", headerName: "Entrega", width: 130 },
  {
    field: "agendamento",
    headerName: "Horario",
    width: 150,
    valueGetter: (_value, row) => row.horarioEntrega || row.horarioRetirada || "-",
  },
  {
    field: "desconto",
    headerName: "Desconto",
    width: 120,
    valueFormatter: (value?: number) => `${value ?? 0}%`,
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    renderCell: ({ value }) => <Chip label={String(value)} color="primary" variant="outlined" />,
  },
  {
    field: "itens",
    headerName: "Itens",
    width: 120,
    valueGetter: (_value, row) => row.itens.length,
  },
];

function toPayload(values: OrderFormValues): OrderPayload {
  return {
    nomeRecebedor: values.nomeRecebedor,
    endereco: values.endereco,
    complemento: values.complemento,
    referencia: values.referencia,
    tipoEntrega: values.tipoEntrega,
    horarioEntrega: values.horarioEntrega,
    horarioRetirada: values.horarioRetirada,
    observacoes: values.observacoes,
    desconto: values.desconto,
    status: values.status,
    itens: values.itens,
  };
}

export default function OrdersPage() {
  const { data, isLoading, isError } = useOrders();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const orders = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  async function handleCreate(values: OrderFormValues) {
    await createOrder.mutateAsync(toPayload(values));
    enqueueSnackbar("Pedido criado com sucesso.", { variant: "success" });
    setCreateOpen(false);
  }

  async function handleUpdate(values: OrderFormValues) {
    if (!selectedOrder) {
      return;
    }

    await updateOrder.mutateAsync({
      id: selectedOrder.id,
      payload: toPayload(values),
    });
    enqueueSnackbar("Pedido atualizado com sucesso.", { variant: "success" });
    setEditOpen(false);
  }

  async function handleDelete() {
    if (!selectedOrder) {
      enqueueSnackbar("Selecione um pedido antes de excluir.", { variant: "warning" });
      return;
    }

    await deleteOrder.mutateAsync(selectedOrder.id);
    enqueueSnackbar("Pedido excluido com sucesso.", { variant: "success" });
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Typography variant="h4">Pedidos</Typography>
        <Typography color="text.secondary">
          CRUD conectado aos endpoints `/pedidos` da API.
        </Typography>
      </Box>

      <Card>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => setCreateOpen(true)}>
            Inserir
          </Button>
          <Button
            startIcon={<EditRoundedIcon />}
            variant="outlined"
            onClick={() => {
              if (!selectedOrder) {
                enqueueSnackbar("Selecione um pedido para alterar.", { variant: "warning" });
                return;
              }

              setEditOpen(true);
            }}
          >
            Alterar
          </Button>
          <Button startIcon={<DeleteRoundedIcon />} color="error" variant="outlined" onClick={handleDelete}>
            Deletar
          </Button>
        </Toolbar>
      </Card>

      <Card>
        <CardContent sx={{ height: 520 }}>
          {isLoading ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Alert severity="error">Nao foi possivel carregar os pedidos.</Alert>
          ) : (
            <DataGrid
              rows={orders}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              onRowClick={(params) => setSelectedOrderId(Number(params.id))}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>

      <OrderFormDialog
        open={createOpen}
        title="Novo pedido"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <OrderFormDialog
        open={editOpen}
        title="Alterar pedido"
        initialData={selectedOrder}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />
    </Box>
  );
}
