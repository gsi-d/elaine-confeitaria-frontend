"use client";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { ProductCard } from "@/features/catalog/components/product-card";
import { ProductDetailsDialog } from "@/features/catalog/components/product-details-dialog";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { CatalogProduct } from "@/features/catalog/types";

const availabilityOptions = [
  { label: "Todos", value: "all" },
  { label: "Com preco", value: "priced" },
  { label: "Sem preco", value: "unpriced" },
] as const;

export default function CatalogPage() {
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { data: products = [], isLoading, isError } = useProducts();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [availability, setAvailability] = useState<(typeof availabilityOptions)[number]>(availabilityOptions[0]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.categoria))).sort(),
    [products],
  );
  const sizes = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.tamanho).filter((size): size is string => Boolean(size))),
      ).sort(),
    [products],
  );
  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch === "" ||
        [product.nome, product.descricao, product.categoria, product.tamanho ?? "", product.tempoEntrega]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
      const matchesSize = !selectedSize || product.tamanho === selectedSize;
      const matchesAvailability =
        availability.value === "all" ||
        (availability.value === "priced" && typeof product.precoUnitario === "number") ||
        (availability.value === "unpriced" && typeof product.precoUnitario !== "number");

      return matchesSearch && matchesCategory && matchesSize && matchesAvailability;
    });
  }, [availability.value, products, search, selectedCategory, selectedSize]);

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
          <Typography variant="h4">Catalogo</Typography>
          <Typography color="text.secondary">Carregando produtos...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
          <Typography variant="h4">Catalogo</Typography>
          <Chip icon={<Inventory2RoundedIcon />} label={`${filteredProducts.length} produtos visiveis`} />
        </Stack>
        <Typography color="text.secondary">
          Explore os produtos da confeitaria com filtros por texto e propriedades do item.
        </Typography>
      </Box>

      <Card
        sx={{
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.42), transparent 26%), linear-gradient(135deg, #fff6ef 0%, #ffeef4 48%, #f4efff 100%)",
        }}
      >
        <CardContent sx={{ display: "grid", gap: 2.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TuneRoundedIcon color="primary" />
            <Typography variant="h6">Filtros</Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <TextField
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                label="Buscar por texto"
                placeholder="Nome, descricao, categoria ou tamanho"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 2.33 }}>
              <Autocomplete
                options={categories}
                value={selectedCategory}
                onChange={(_event, value) => setSelectedCategory(value)}
                renderInput={(params) => <TextField {...params} label="Categoria" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 2.33 }}>
              <Autocomplete
                options={sizes}
                value={selectedSize}
                onChange={(_event, value) => setSelectedSize(value)}
                renderInput={(params) => <TextField {...params} label="Tamanho" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 2.34 }}>
              <Autocomplete
                options={availabilityOptions}
                value={availability}
                onChange={(_event, value) => setAvailability(value ?? availabilityOptions[0])}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => <TextField {...params} label="Carrinho" />}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedCategory ? <Chip label={`Categoria: ${selectedCategory}`} onDelete={() => setSelectedCategory(null)} /> : null}
            {selectedSize ? <Chip label={`Tamanho: ${selectedSize}`} onDelete={() => setSelectedSize(null)} /> : null}
            {availability.value !== "all" ? (
              <Chip label={`Filtro: ${availability.label}`} onDelete={() => setAvailability(availabilityOptions[0])} />
            ) : null}
            {search.trim() !== "" ? <Chip label={`Busca: ${search}`} onDelete={() => setSearch("")} /> : null}
          </Box>
        </CardContent>
      </Card>

      {isLoading ? (
        <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Nao foi possivel carregar os produtos da API.</Alert>
      ) : products.length === 0 ? (
        <Alert severity="info">Nenhum produto foi retornado pelo backend.</Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert severity="info">Nenhum produto corresponde aos filtros aplicados.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
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

      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addProductToCart}
      />
    </Box>
  );
}
