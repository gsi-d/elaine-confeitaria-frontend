"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoginFormValues, loginSchema } from "@/features/auth/schemas/login-schema";

export function LoginForm() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);

    try {
      await login(values);
    } catch {
      setErrorMessage("Não foi possível entrar. Verifique seu e-mail e senha.");
    }
  }

  return (
    <Paper elevation={6} sx={{ p: 5, width: "100%", maxWidth: 460 }}>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
          <BrandLogo iconSize={72} stacked />
          <Typography variant="h4">Login</Typography>
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            Entre para acompanhar seus pedidos e finalizar compras.
          </Typography>
        </Box>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "grid", gap: 2.5 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="E-mail"
                  type="email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="senha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha"
                  type="password"
                  error={Boolean(errors.senha)}
                  helperText={errors.senha?.message}
                  fullWidth
                />
              )}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Entrar"}
              </Button>
              <Button href="/cadastro" variant="outlined" size="large">
                Criar conta
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
