"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
      email: "cliente@elaine.com",
      senha: "123456",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);

    try {
      await login(values);
    } catch {
      setErrorMessage("Nao foi possivel autenticar. Verifique as credenciais e a API.");
    }
  }

  return (
    <Paper elevation={6} sx={{ p: 5, width: "100%", maxWidth: 460 }}>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h4">Login</Typography>
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            Acesso ao painel administrativo da Elaine Confeitaria
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
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Entrar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
