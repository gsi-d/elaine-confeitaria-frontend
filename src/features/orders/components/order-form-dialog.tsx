"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  OrderFormInput,
  OrderFormValues,
  orderSchema,
} from "@/features/orders/schemas/order-schema";
import { Order } from "@/features/orders/types";

type OrderFormDialogProps = {
  open: boolean;
  initialData?: Order | null;
  title: string;
  onClose: () => void;
  onSubmit: (values: OrderFormValues) => Promise<void>;
};

const defaultValues: OrderFormInput = {
  nomeRecebedor: "",
  endereco: "",
  complemento: "",
  referencia: "",
  tipoEntrega: "ENTREGA",
  horarioEntrega: "",
  horarioRetirada: "",
  observacoes: "",
  desconto: 0,
  status: "EM_ABERTO",
  itens: [{ produtoId: 1, quantidade: 1 }],
};

export function OrderFormDialog({
  open,
  initialData,
  title,
  onClose,
  onSubmit,
}: OrderFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormInput, unknown, OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });
  const tipoEntrega = useWatch({
    control,
    name: "tipoEntrega",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      initialData
        ? {
            id: initialData.id,
            nomeRecebedor: initialData.nomeRecebedor ?? "",
            endereco: initialData.endereco ?? "",
            complemento: initialData.complemento ?? "",
            referencia: initialData.referencia ?? "",
            tipoEntrega: initialData.tipoEntrega,
            horarioEntrega: initialData.horarioEntrega ?? "",
            horarioRetirada: initialData.horarioRetirada ?? "",
            observacoes: initialData.observacoes ?? "",
            desconto: initialData.desconto,
            status: initialData.status,
            itens: initialData.itens,
          }
        : defaultValues,
    );
  }, [initialData, open, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  async function submit(values: OrderFormValues) {
    await onSubmit(values);
    reset(defaultValues);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Controller
              name="tipoEntrega"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Tipo de entrega">
                  <MenuItem value="ENTREGA">Entrega</MenuItem>
                  <MenuItem value="RETIRADA">Retirada</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="nomeRecebedor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome de quem vai receber"
                  fullWidth
                  error={Boolean(errors.nomeRecebedor)}
                  helperText={errors.nomeRecebedor?.message}
                />
              )}
            />
          </Box>

          {tipoEntrega === "ENTREGA" ? (
            <>
              <Alert severity="info" sx={{ borderRadius: "18px" }}>
                Para entrega, informe recebedor, endereco e horario preferido.
              </Alert>
              <Controller
                name="endereco"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Endereco"
                    fullWidth
                    error={Boolean(errors.endereco)}
                    helperText={errors.endereco?.message}
                  />
                )}
              />
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <Controller
                  name="complemento"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Complemento" fullWidth />}
                />
                <Controller
                  name="referencia"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Referencia" fullWidth />}
                />
              </Box>
              <Controller
                name="horarioEntrega"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="time"
                    label="Melhor horario de entrega"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={Boolean(errors.horarioEntrega)}
                    helperText={errors.horarioEntrega?.message}
                  />
                )}
              />
            </>
          ) : (
            <Controller
              name="horarioRetirada"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="time"
                  label="Horario para retirada"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={Boolean(errors.horarioRetirada)}
                  helperText={errors.horarioRetirada?.message}
                />
              )}
            />
          )}

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Controller
              name="desconto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Desconto"
                  fullWidth
                  error={Boolean(errors.desconto)}
                  helperText={errors.desconto?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Status" fullWidth helperText="Ex.: EM_ABERTO ou EM_PREPARO" />
              )}
            />
          </Box>

          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => <TextField {...field} label="Observacoes" fullWidth multiline minRows={2} />}
          />

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
                alignItems: "start",
              }}
            >
              <Controller
                name={`itens.${index}.produtoId`}
                control={control}
                render={({ field: itemField }) => (
                  <TextField
                    {...itemField}
                    type="number"
                    label={`Produto ID ${index + 1}`}
                    fullWidth
                    error={Boolean(errors.itens?.[index]?.produtoId)}
                    helperText={errors.itens?.[index]?.produtoId?.message}
                  />
                )}
              />
              <Controller
                name={`itens.${index}.quantidade`}
                control={control}
                render={({ field: itemField }) => (
                  <TextField
                    {...itemField}
                    type="number"
                    label="Quantidade"
                    fullWidth
                    error={Boolean(errors.itens?.[index]?.quantidade)}
                    helperText={errors.itens?.[index]?.quantidade?.message}
                  />
                )}
              />
              <Button color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                Remover
              </Button>
            </Box>
          ))}
          <Button variant="text" onClick={() => append({ produtoId: 1, quantidade: 1 })}>
            Adicionar item
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(submit)} disabled={isSubmitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
