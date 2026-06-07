"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { authService } from "@/features/auth/api/auth-service";
import { SignupFormValues, signupSchema } from "@/features/auth/schemas/signup-schema";

export function SignupForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      senha: "",
      endereco: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await authService.register(values);
      setSuccessMessage("Conta criada com sucesso. Voce ja pode entrar.");
      router.push("/login");
    } catch {
      setErrorMessage("Nao foi possivel criar a conta. Verifique os dados e a API.");
    }
  }

  return (
    <Paper elevation={6} sx={{ p: 5, width: "100%", maxWidth: 560 }}>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <PersonAddAltRoundedIcon />
          </Avatar>
          <Typography variant="h4">Criar conta</Typography>
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            Cadastre seus dados para acompanhar pedidos e finalizar compras.
          </Typography>
        </Box>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

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
            <Controller
              name="endereco"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Endereco"
                  error={Boolean(errors.endereco)}
                  helperText={errors.endereco?.message}
                  fullWidth
                />
              )}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefone"
                    error={Boolean(errors.telefone)}
                    helperText={errors.telefone?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CPF"
                    error={Boolean(errors.cpf)}
                    helperText={errors.cpf?.message}
                    fullWidth
                  />
                )}
              />
            </Stack>
            <Controller
              name="dataNascimento"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data de nascimento"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={Boolean(errors.dataNascimento)}
                  helperText={errors.dataNascimento?.message}
                  fullWidth
                />
              )}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Criar conta"}
              </Button>
              <Button href="/login" variant="outlined" size="large">
                Ja tenho conta
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
