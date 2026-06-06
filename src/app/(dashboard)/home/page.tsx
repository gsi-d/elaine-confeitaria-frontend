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
import { CatalogProduct } from "@/features/catalog/types";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { formatCurrency } from "@/lib/utils/format";

export default function HomePage() {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { isAdmin } = useAuth();
  const { addItem, items, total } = useCart();
  const { data: products = [], isLoading, isError } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const categories = Array.from(new Set(products.map((product) => product.categoria)));

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
    <Box sx={{ display: "grid", gap: 4.5 }}>
      <Card
        sx={{
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.34), transparent 28%), linear-gradient(135deg, #f7d2df 0%, #f6e6d8 55%, #eadff7 100%)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6.5 }}>
              <Stack spacing={2}>
                <Chip
                  label={isAdmin ? "Visao administrativa" : "Confeitaria artesanal"}
                  color="secondary"
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                />
                <Typography variant="h4">
                  {isAdmin
                    ? "Acompanhe a operacao do dia com a mesma vitrine que o cliente enxerga."
                    : "Sobremesas que chamam atencao na primeira dobra e convertem mais rapido."}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                  {isAdmin
                    ? "Voce tem uma home mais operacional para acompanhar pedidos, vitrine e ticket, sem poluir a experiencia de quem esta comprando."
                    : "Uma entrada mais emocional, com cara de outdoor de confeitaria: produto em destaque, preco claro e caminho curto ate o carrinho."}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button variant="contained" href="/carrinho">
                    {isAdmin ? "Revisar carrinho" : "Montar meu pedido"}
                  </Button>
                  <Button variant="outlined" href="/pedidos">
                    {isAdmin ? "Acompanhar pedidos" : "Ver agenda de pedidos"}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5.5 }}>
              {isAdmin ? (
                <Box
                  sx={{
                    p: { xs: 2.25, md: 2.5 },
                    borderRadius: "26px",
                    bgcolor: "rgba(255,255,255,0.78)",
                    display: "grid",
                    gap: 1.5,
                    boxShadow: "0 18px 40px rgba(177, 134, 159, 0.12)",
                    maxWidth: 460,
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
                    minHeight: { xs: 220, md: 280 },
                    maxWidth: 500,
                    ml: { md: "auto" },
                    borderRadius: "28px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 22px 50px rgba(179, 133, 156, 0.18)",
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
                      left: 20,
                      right: 20,
                      bottom: 18,
                      color: "#fffafc",
                      display: "grid",
                      gap: 0.75,
                    }}
                  >
                    <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 1.1 }}>
                      Destaque da vitrine
                    </Typography>
                    <Typography variant="h5" sx={{ maxWidth: 360 }}>
                      Tortas, bolos e doces com cara de presente e entrega no mesmo dia.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.92, maxWidth: 320 }}>
                      Sabores delicados, acabamento bonito e entrega pensada para impressionar.
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
          {
            title: "Pedidos ativos",
            value: "24",
            icon: <ReceiptLongRoundedIcon color="primary" />,
            helper: "Fila em andamento",
          },
          {
            title: "Itens no carrinho",
            value: String(items.length),
            icon: <Inventory2RoundedIcon color="primary" />,
            helper: "Selecao atual",
          },
          {
            title: "Total estimado",
            value: formatCurrency(total),
            icon: <AddShoppingCartRoundedIcon color="primary" />,
            helper: "Ticket projetado",
          },
          {
            title: "Entrega media",
            value: "35 min",
            icon: <LocalShippingRoundedIcon color="primary" />,
            helper: "Janela atual",
          },
        ].map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
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
              Cards mais informativos, com leitura de preco e entrega no mesmo bloco.
            </Typography>
          </Box>
          <Chip icon={<StorefrontRoundedIcon />} label={`${products.length} itens no catalogo`} />
        </Stack>
        {isLoading ? (
          <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Nao foi possivel carregar os produtos da API.</Alert>
        ) : products.length === 0 ? (
          <Alert severity="info">Nenhum produto foi retornado pelo backend.</Alert>
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
