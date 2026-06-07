"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useMemo, useSyncExternalStore } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { CatalogProduct } from "@/features/catalog/types";
import { useCreateOrder } from "@/features/orders/hooks/use-orders";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { orderSchema } from "@/features/orders/schemas/order-schema";
import { formatCurrency } from "@/lib/utils/format";

export default function CartPage() {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const router = useRouter();
  const {
    addItem,
    items,
    total,
    clearCart,
    removeItem,
    updateQuantity,
    checkoutDraft,
    updateCheckoutDraft,
    resetCheckoutDraft,
  } = useCart();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const createOrder = useCreateOrder();
  const suggestedProducts = useMemo<CatalogProduct[]>(() => {
    const productsByProdutoId = new Map(products.map((product) => [product.produtoId, product] as const));
    const cartProdutoIds = new Set(items.map((item) => item.produtoId));
    const cooccurrenceScores = new Map<number, number>();
    const overallScores = new Map<number, number>();

    for (const order of orders) {
      const uniqueProdutoIds = Array.from(new Set(order.itens.map((item) => item.produtoId)));
      const overlapCount = uniqueProdutoIds.filter((produtoId) => cartProdutoIds.has(produtoId)).length;

      for (const produtoId of uniqueProdutoIds) {
        overallScores.set(produtoId, (overallScores.get(produtoId) ?? 0) + 1);
      }

      if (overlapCount === 0) {
        continue;
      }

      for (const produtoId of uniqueProdutoIds) {
        if (cartProdutoIds.has(produtoId)) {
          continue;
        }

        cooccurrenceScores.set(produtoId, (cooccurrenceScores.get(produtoId) ?? 0) + overlapCount);
      }
    }

    const rankedIds = Array.from(
      new Set([
        ...cooccurrenceScores.keys(),
        ...overallScores.keys(),
      ]),
    ).sort((left, right) => {
      const scoreDiff = (cooccurrenceScores.get(right) ?? 0) - (cooccurrenceScores.get(left) ?? 0);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return (overallScores.get(right) ?? 0) - (overallScores.get(left) ?? 0);
    });

    return rankedIds
      .map((produtoId) => productsByProdutoId.get(produtoId))
      .filter((product): product is CatalogProduct => {
        if (!product || typeof product.precoUnitario !== "number") {
          return false;
        }

        return !items.some((item) => item.produtoId === product.produtoId);
      })
      .slice(0, 3);
  }, [items, orders, products]);

  if (!hasMounted) {
    return (
      <Box sx={{ display: "grid", gap: 3.5 }}>
        <Box>
          <Typography variant="h4">Carrinho</Typography>
          <Typography color="text.secondary">Carregando seu pedido...</Typography>
        </Box>
      </Box>
    );
  }

  const subtotal = total;
  const deliveryFee = items.length > 0 && checkoutDraft.tipoEntrega === "ENTREGA" ? 8 : 0;
  const discount = subtotal >= 120 ? 12 : 0;
  const finalTotal = subtotal + deliveryFee - discount;
  const isDelivery = checkoutDraft.tipoEntrega === "ENTREGA";

  const validationResult = orderSchema.safeParse({
    ...checkoutDraft,
    desconto: discount,
    itens: items.map((item) => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
    })),
  });
  const checkoutErrors = validationResult.success ? {} : validationResult.error.flatten().fieldErrors;

  async function handleCheckout() {
    const result = orderSchema.safeParse({
      ...checkoutDraft,
      desconto: discount,
      itens: items.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
      })),
    });

    if (!result.success) {
      enqueueSnackbar("Preencha os dados obrigatorios do pedido antes de finalizar.", {
        variant: "warning",
      });
      return;
    }

    const createdOrder = await createOrder.mutateAsync({
      nomeRecebedor: result.data.nomeRecebedor,
      endereco: result.data.endereco,
      complemento: result.data.complemento,
      referencia: result.data.referencia,
      tipoEntrega: result.data.tipoEntrega,
      melhorHorarioEntrega: result.data.horarioEntrega || result.data.horarioRetirada || undefined,
      observacoes: result.data.observacoes,
      anexo: [],
      desconto: result.data.desconto,
      itens: result.data.itens,
    });
    clearCart();
    resetCheckoutDraft();
    enqueueSnackbar("Pedido enviado com sucesso.", { variant: "success" });
    router.push(`/meus-pedidos?current=${createdOrder.id}`);
  }

  return (
    <Box sx={{ display: "grid", gap: 3.5 }}>
      <Box>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "flex-start", md: "center" } }}
        >
          <Typography variant="h4">Carrinho</Typography>
          <Chip label="Fluxo de fechamento inspirado em delivery" color="secondary" variant="outlined" />
        </Stack>
        <Typography color="text.secondary">
          O carrinho e os dados do checkout ficam em memoria e persistidos localmente enquanto o pedido nao for enviado.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
        {["Catalogo", "Carrinho", "Fechamento"].map((step, index) => (
          <Chip
            key={step}
            label={`${index + 1}. ${step}`}
            color={index < 2 ? "primary" : "default"}
            variant={index < 2 ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "grid", gap: 2 }}>
            {items.length === 0 ? (
              <Card>
                <CardContent sx={{ display: "grid", gap: 1 }}>
                  <Typography variant="h6">Carrinho vazio.</Typography>
                  <Typography color="text.secondary">
                    Volte para a vitrine e adicione os itens para montar o pedido.
                  </Typography>
                  <Button href="/home" variant="contained" sx={{ width: "fit-content" }}>
                    Ir para produtos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                      }}
                    >
                      <Box sx={{ display: "grid", gap: 1 }}>
                        <Typography variant="h6">{item.nome}</Typography>
                        <Typography color="text.secondary">
                          {formatCurrency(item.precoUnitario)} por unidade
                        </Typography>
                        <Chip label="Producao artesanal" size="small" sx={{ width: "fit-content" }} />
                      </Box>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                        <TextField
                          type="number"
                          size="small"
                          label="Quantidade"
                          value={item.quantidade}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                          sx={{ width: 120 }}
                        />
                        <Typography sx={{ fontWeight: 800 }}>
                          {formatCurrency(item.precoUnitario * item.quantidade)}
                        </Typography>
                        <IconButton color="error" onClick={() => removeItem(item.id)}>
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}

            {suggestedProducts.length > 0 ? (
              <Card>
                <CardContent sx={{ display: "grid", gap: 2 }}>
                  <Typography variant="h6">Quem pediu isso tambem leva</Typography>
                  <Grid container spacing={2}>
                    {suggestedProducts.map((product) => (
                      <Grid key={product.id} size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            borderRadius: "24px",
                            background: product.cor,
                            display: "grid",
                            gap: 1.25,
                            height: "100%",
                            alignContent: "start",
                            overflow: "hidden",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28)",
                          }}
                        >
                          {product.imagemUrl ? (
                            <Box
                              component="img"
                              src={product.imagemUrl}
                              alt={product.imagemAlt ?? product.nome}
                              sx={{
                                width: "100%",
                                height: 148,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : null}
                          <Box sx={{ p: 2.25, display: "grid", gap: 1.25 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {product.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.tempoEntrega}
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {typeof product.precoUnitario === "number"
                              ? formatCurrency(product.precoUnitario)
                              : "Preco sob consulta"}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={typeof product.precoUnitario !== "number"}
                            onClick={() => {
                              if (typeof product.precoUnitario !== "number") {
                                return;
                              }

                              addItem({
                                id: product.id,
                                produtoId: product.produtoId,
                                nome: product.nome,
                                quantidade: 1,
                                precoUnitario: product.precoUnitario,
                              });
                            }}
                          >
                            Adicionar
                          </Button>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ position: { lg: "sticky" }, top: { lg: 112 } }}>
            <CardContent sx={{ display: "grid", gap: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <ReceiptLongRoundedIcon color="primary" />
                <Typography variant="h6">Resumo do pedido</Typography>
              </Stack>
              <TextField
                select
                label="Tipo do pedido"
                value={checkoutDraft.tipoEntrega}
                onChange={(event) =>
                  updateCheckoutDraft({
                    tipoEntrega: event.target.value as "ENTREGA" | "RETIRADA",
                  })
                }
              >
                <MenuItem value="ENTREGA">Entrega</MenuItem>
                <MenuItem value="RETIRADA">Retirada no local</MenuItem>
              </TextField>

              {isDelivery ? (
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <TextField
                    label="Nome de quem vai receber"
                    value={checkoutDraft.nomeRecebedor}
                    onChange={(event) => updateCheckoutDraft({ nomeRecebedor: event.target.value })}
                    error={Boolean(checkoutErrors.nomeRecebedor)}
                    helperText={checkoutErrors.nomeRecebedor?.[0]}
                  />
                  <TextField
                    label="Endereco"
                    value={checkoutDraft.endereco}
                    onChange={(event) => updateCheckoutDraft({ endereco: event.target.value })}
                    error={Boolean(checkoutErrors.endereco)}
                    helperText={checkoutErrors.endereco?.[0]}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.5,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      label="Complemento"
                      value={checkoutDraft.complemento}
                      onChange={(event) => updateCheckoutDraft({ complemento: event.target.value })}
                    />
                    <TextField
                      label="Referencia"
                      value={checkoutDraft.referencia}
                      onChange={(event) => updateCheckoutDraft({ referencia: event.target.value })}
                    />
                  </Box>
                  <TextField
                    label="Melhor horario de entrega"
                    type="time"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={checkoutDraft.horarioEntrega}
                    onChange={(event) => updateCheckoutDraft({ horarioEntrega: event.target.value })}
                    error={Boolean(checkoutErrors.horarioEntrega)}
                    helperText={checkoutErrors.horarioEntrega?.[0]}
                  />
                </Box>
              ) : (
                <TextField
                  label="Horario para retirada"
                  type="time"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={checkoutDraft.horarioRetirada}
                  onChange={(event) => updateCheckoutDraft({ horarioRetirada: event.target.value })}
                  error={Boolean(checkoutErrors.horarioRetirada)}
                  helperText={checkoutErrors.horarioRetirada?.[0]}
                />
              )}

              <TextField
                label="Observacoes"
                multiline
                minRows={2}
                value={checkoutDraft.observacoes}
                onChange={(event) => updateCheckoutDraft({ observacoes: event.target.value })}
              />

              <Alert
                icon={<LocalShippingRoundedIcon fontSize="inherit" />}
                severity="success"
                sx={{ borderRadius: 3 }}
              >
                {isDelivery
                  ? "Entrega estimada entre 30 e 45 minutos."
                  : "Retirada agendada conforme o horario informado."}
              </Alert>
              <Stack spacing={1.2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{formatCurrency(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography color="text.secondary">Entrega</Typography>
                  <Typography>{formatCurrency(deliveryFee)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography color="text.secondary">Desconto</Typography>
                  <Typography color={discount > 0 ? "success.main" : "text.primary"}>
                    - {formatCurrency(discount)}
                  </Typography>
                </Box>
              </Stack>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5">{formatCurrency(finalTotal)}</Typography>
              </Box>
              <Button
                variant="contained"
                disabled={items.length === 0 || createOrder.isPending}
                onClick={handleCheckout}
              >
                Fechar pedido
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  clearCart();
                  resetCheckoutDraft();
                }}
                disabled={items.length === 0}
              >
                Limpar carrinho
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
