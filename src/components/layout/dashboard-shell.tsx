"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

const expandedDrawerWidth = 288;
const collapsedDrawerWidth = 92;

const menuItems = [
  { label: "Home", href: "/home", icon: <HomeRoundedIcon /> },
  { label: "Catalogo", href: "/catalogo", icon: <StorefrontRoundedIcon /> },
  { label: "Meus pedidos", href: "/meus-pedidos", icon: <ReceiptLongRoundedIcon /> },
  { label: "Pedidos", href: "/pedidos", icon: <ReceiptLongRoundedIcon /> },
  { label: "Carrinho", href: "/carrinho", icon: <ShoppingCartRoundedIcon /> },
];

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const currentDrawerWidth = desktopCollapsed ? collapsedDrawerWidth : expandedDrawerWidth;

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
        {!collapsed ? (
          <Box
            sx={{
              mt: 3,
              px: 2.25,
              py: 2,
              borderRadius: "28px",
              color: "#fff",
              background: "linear-gradient(135deg, #d86f9d 0%, #b79be6 100%)",
              boxShadow: "0 16px 30px rgba(184, 116, 171, 0.22)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.86 }}>
              Operacao do dia
            </Typography>
            <Typography variant="h6">12 pedidos em preparo</Typography>
            <Typography variant="body2" sx={{ opacity: 0.86 }}>
              3 saem nos proximos 20 minutos
            </Typography>
          </Box>
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
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            minHeight: 56,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>
          {!collapsed ? <ListItemText primary="Sair" secondary="Encerrar sessao" /> : null}
        </ListItemButton>
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
          <IconButton sx={{ bgcolor: "rgba(216,111,157,0.08)" }}>
            <NotificationsRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
