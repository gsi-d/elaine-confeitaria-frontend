"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCart } from "@/features/cart/hooks/use-cart";

const expandedDrawerWidth = 288;
const collapsedDrawerWidth = 92;

const menuItems = [
  { label: "Home", href: "/home", icon: <HomeRoundedIcon /> },
  { label: "Catalogo", href: "/catalogo", icon: <StorefrontRoundedIcon /> },
  { label: "Operacao", href: "/operacao", icon: <FactCheckRoundedIcon /> },
  { label: "Meus pedidos", href: "/meus-pedidos", icon: <ReceiptLongRoundedIcon /> },
  { label: "Pedidos", href: "/pedidos", icon: <ReceiptLongRoundedIcon /> },
  { label: "Carrinho", href: "/carrinho", icon: <ShoppingCartRoundedIcon /> },
];

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const hasMounted = useSyncExternalStore(
    (onStoreChange) => {
      queueMicrotask(onStoreChange);
      return () => {};
    },
    () => true,
    () => false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [operationVisible, setOperationVisible] = useState(true);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);
  const cartItemsCount = useMemo(
    () => items.reduce((total, item) => total + item.quantidade, 0),
    [items],
  );

  const currentDrawerWidth = desktopCollapsed ? collapsedDrawerWidth : expandedDrawerWidth;

  function toggleOperationVisibility() {
    setOperationVisible((current) => {
      const next = !current;
      window.localStorage.setItem("elaine_dashboard_operation_visible", String(next));
      return next;
    });
  }

  function handleOpenProfileMenu(event: React.MouseEvent<HTMLElement>) {
    setProfileMenuAnchor(event.currentTarget);
  }

  function handleCloseProfileMenu() {
    setProfileMenuAnchor(null);
  }

  function handleLogout() {
    handleCloseProfileMenu();
    logout();
  }

  const drawerContent = (collapsed = false) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #fffdfb 0%, #fff4f6 100%)",
      }}
    >
      <Box sx={{ p: collapsed ? 2 : 3, pb: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="h6"
              color="primary.main"
              sx={{ whiteSpace: "nowrap", opacity: collapsed ? 0 : 1, transition: "opacity 0.2s ease" }}
            >
              Elaine Confeitaria
            </Typography>
            {!collapsed ? (
              <Typography variant="body2" color="text.secondary">
                Pedidos com cara de vitrine
              </Typography>
            ) : null}
          </Box>
          <IconButton
            onClick={() => setDesktopCollapsed((value) => !value)}
            sx={{ display: { xs: "none", md: "inline-flex" }, bgcolor: "rgba(216,111,157,0.08)" }}
          >
            {collapsed ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
          </IconButton>
        </Stack>
        {!collapsed && operationVisible ? (
          <Box
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: "18px",
              color: "#fff",
              background: "linear-gradient(135deg, #d86f9d 0%, #b79be6 100%)",
              boxShadow: "0 10px 20px rgba(184, 116, 171, 0.16)",
              display: "grid",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.25, opacity: 0.9 }}>
                Operacao
              </Typography>
              <IconButton
                size="small"
                onClick={toggleOperationVisibility}
                sx={{ color: "inherit", bgcolor: "rgba(255,255,255,0.14)" }}
              >
                <VisibilityOffRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <Box sx={{ display: "grid", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "baseline" }}>
                <Typography sx={{ fontSize: 11.5, opacity: 0.84 }}>Preparo</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>12</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "baseline" }}>
                <Typography sx={{ fontSize: 11.5, opacity: 0.84 }}>Saem logo</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>3</Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
        {!collapsed && !operationVisible ? (
          <Button
            variant="text"
            size="small"
            startIcon={<VisibilityRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={toggleOperationVisibility}
            sx={{ mt: 1, px: 0, justifyContent: "flex-start", textTransform: "none" }}
          >
            Mostrar operacao
          </Button>
        ) : null}
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: collapsed ? 1.25 : 2, py: 1.5 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.href} title={collapsed ? item.label : ""} placement="right">
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname.startsWith(item.href)}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 3,
                mb: 1,
                minHeight: 56,
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 1.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(216, 111, 157, 0.14)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 42,
                  color: "primary.main",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} secondary="Acesso rapido" /> : null}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ p: collapsed ? 1.25 : 2 }}>
        {hasMounted ? (
          !isAuthenticated ? (
            <ListItemButton
              component={Link}
              href="/login"
              sx={{
                borderRadius: 3,
                minHeight: 56,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              {!collapsed ? <ListItemText primary="Entrar" secondary="Acessar conta" /> : null}
            </ListItemButton>
          ) : (
            <Box sx={{ minHeight: 56 }} />
          )
        ) : (
          <Box sx={{ minHeight: 56 }} />
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          ml: { md: `${currentDrawerWidth}px` },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((value) => !value)}
            sx={{ display: { md: "none" }, mr: 2 }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Vitrine de pedidos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fluxo inspirado em delivery e marketplace, com leitura rapida do pedido.
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Buscar produto, pedido ou cliente"
            sx={{
              display: { xs: "none", lg: "block" },
              minWidth: 320,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.84)",
              },
            }}
            slotProps={{
              input: {
                startAdornment: <SearchRoundedIcon fontSize="small" style={{ marginRight: 8, opacity: 0.7 }} />,
              },
            }}
          />
          <Chip
            label="Entrega ate 45 min"
            color="secondary"
            variant="outlined"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          />
          <IconButton
            component={Link}
            href="/carrinho"
            sx={{ bgcolor: "rgba(216,111,157,0.08)" }}
          >
            <Badge badgeContent={hasMounted ? cartItemsCount : 0} color="primary">
              <ShoppingCartRoundedIcon />
            </Badge>
          </IconButton>
          <IconButton sx={{ bgcolor: "rgba(216,111,157,0.08)" }}>
            <NotificationsRoundedIcon />
          </IconButton>
          {hasMounted ? (
            !isAuthenticated ? (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Button component={Link} href="/login" variant="outlined" size="small">
                  Entrar
                </Button>
                <Button
                  component={Link}
                  href="/cadastro"
                  variant="contained"
                  size="small"
                  sx={{ minWidth: 116, whiteSpace: "nowrap" }}
                >
                  Criar conta
                </Button>
              </Stack>
            ) : (
              <Tooltip title="Perfil">
                <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0.25 }} aria-label="Perfil">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: "rgba(216,111,157,0.14)", color: "primary.main" }}>
                    <AccountCircleRoundedIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
            )
          ) : (
            <Box sx={{ width: 160, height: 36, flexShrink: 0 }} />
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleCloseProfileMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem component={Link} href="/meus-pedidos" onClick={handleCloseProfileMenu}>
          Meus pedidos
        </MenuItem>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: expandedDrawerWidth },
          }}
        >
          {drawerContent()}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: currentDrawerWidth,
              boxSizing: "border-box",
              transition: "width 0.2s ease",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent(desktopCollapsed)}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          pb: 4,
          pt: { xs: 10, md: 12 },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
