"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCart } from "@/features/cart/hooks/use-cart";
import { ProductCard } from "@/features/catalog/components/product-card";
import { ProductDetailsDialog } from "@/features/catalog/components/product-details-dialog";
import { useDeliveryConfiguration } from "@/features/delivery-config/hooks/use-delivery-config";
import { CatalogProduct } from "@/features/catalog/types";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { countActiveOrders } from "@/features/orders/metrics";
import { formatCurrency, formatDeliveryEstimate } from "@/lib/utils/format";

export default function HomePage() {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { isAdmin } = useAuth();
  const { addItem, items, total } = useCart();
  const { data: products = [], isLoading, isError } = useProducts();
  const { data: orders = [] } = useOrders(isAdmin);
  const { data: deliveryConfiguration } = useDeliveryConfiguration();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const categories = Array.from(new Set(products.map((product) => product.categoria)));
  const activeOrdersCount = countActiveOrders(orders);
  const deliveryEstimateLabel = formatDeliveryEstimate(
    deliveryConfiguration?.tempoMinimoMinutos,
    deliveryConfiguration?.tempoMaximoMinutos,
  );

  function addProductToCart(product: CatalogProduct) {
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
  }

  if (!hasMounted) {
    return (
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Typography variant="h4">Home</Typography>
          <Typography color="text.secondary">Carregando vitrine...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 4 }}>
      <Card
        sx={{
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.34), transparent 28%), linear-gradient(135deg, #f7d2df 0%, #f6e6d8 55%, #eadff7 100%)",
        }}
      >
        <CardContent sx={{ p: { xs: isAdmin ? 2.5 : 2, md: isAdmin ? 3 : 2.25 } }}>
          <Grid container spacing={2.5} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6.5 }}>
              <Stack spacing={isAdmin ? 1.5 : 1.25}>
                <Chip
                  label={isAdmin ? "Visao administrativa" : "Confeitaria artesanal"}
                  color="secondary"
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                />
                <Typography variant="h4">
                  {isAdmin
                    ? "Acompanhe os pedidos do dia e a vitrine disponível para os clientes."
                    : "Bolos, tortas e doces para deixar qualquer momento mais especial."}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                  {isAdmin
                    ? "Consulte produtos, acompanhe pedidos e acesse rapidamente as áreas principais do sistema."
                    : "Escolha seus produtos, monte o pedido e acompanhe tudo em um só lugar."}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button variant="contained" href="/carrinho">
                    {isAdmin ? "Revisar carrinho" : "Montar meu pedido"}
                  </Button>
                  {isAdmin ? (
                    <Button variant="outlined" href="/pedidos">
                      Acompanhar pedidos
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5.5 }}>
              {isAdmin ? (
                <Box
                  sx={{
                    p: { xs: 2, md: 2.25 },
                    borderRadius: "26px",
                    bgcolor: "rgba(255,255,255,0.78)",
                    display: "grid",
                    gap: 1.25,
                    boxShadow: "0 18px 40px rgba(177, 134, 159, 0.12)",
                    maxWidth: 420,
                    ml: { md: "auto" },
                  }}
                >
                  {[
                    { label: "Pedidos em preparo", value: "12" },
                    { label: "Saindo ate 18h", value: "5" },
                    { label: "Ticket medio hoje", value: formatCurrency(84) },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 1.5,
                        py: 1.2,
                        borderRadius: "18px",
                        bgcolor: "rgba(216,111,157,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography color="text.secondary">{item.label}</Typography>
                      <Typography variant="h6">{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    minHeight: { xs: 150, md: 170 },
                    maxWidth: 320,
                    ml: { md: "auto" },
                    borderRadius: "22px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 14px 30px rgba(179, 133, 156, 0.14)",
                    backgroundColor: "#f4dfe5",
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80"
                    alt="Sobremesa em destaque"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(55, 26, 44, 0.02) 20%, rgba(55, 26, 44, 0.62) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: 14,
                      right: 14,
                      bottom: 12,
                      color: "#fffafc",
                      display: "grid",
                      gap: 0.35,
                    }}
                  >
                    <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1, fontSize: "0.62rem" }}>
                      Destaque da vitrine
                    </Typography>
                    <Typography variant="subtitle1" sx={{ maxWidth: 230, lineHeight: 1.15, fontWeight: 800 }}>
                      Tortas, bolos e doces com apresentação caprichada e entrega no mesmo dia.
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.92, maxWidth: 220, lineHeight: 1.3 }}>
                      Sabores marcantes, acabamento delicado e opções para presentear ou celebrar.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
        {categories.map((category) => (
          <Chip key={category} label={category} variant="filled" sx={{ bgcolor: "rgba(216,111,157,0.12)" }} />
        ))}
      </Box>

      <Grid container spacing={3}>
        {[
          ...(isAdmin
            ? [
                {
                  title: "Pedidos ativos",
                  value: String(activeOrdersCount),
                  icon: <ReceiptLongRoundedIcon color="primary" />,
                  helper: "Fila em andamento",
                },
              ]
            : []),
          {
            title: "Itens no carrinho",
            value: String(items.length),
            icon: <Inventory2RoundedIcon color="primary" />,
            helper: "Selecao atual",
          },
          ...(isAdmin
            ? [
                {
                  title: "Total estimado",
                  value: formatCurrency(total),
                  icon: <AddShoppingCartRoundedIcon color="primary" />,
                  helper: "Ticket projetado",
                },
              ]
            : []),
          {
            title: "Entrega estimada",
            value: deliveryEstimateLabel,
            icon: <LocalShippingRoundedIcon color="primary" />,
            helper: "Janela atual",
          },
        ].map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: isAdmin ? 3 : 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "grid", gap: 1 }}>
                  {card.icon}
                  <Typography color="text.secondary">{card.title}</Typography>
                  <Typography variant="h5">{card.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.helper}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box>
            <Typography variant="h5">Vitrine de produtos</Typography>
            <Typography color="text.secondary">
              Confira os produtos disponíveis e escolha seus favoritos.
            </Typography>
          </Box>
          <Chip icon={<StorefrontRoundedIcon />} label={`${products.length} itens no catálogo`} />
        </Stack>
        {isLoading ? (
          <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Não foi possível carregar os produtos.</Alert>
        ) : products.length === 0 ? (
          <Alert severity="info">Nenhum produto encontrado.</Alert>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <ProductCard
                  product={product}
                  onOpenDetails={setSelectedProduct}
                  onAddToCart={addProductToCart}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addProductToCart}
      />
    </Box>
  );
}
