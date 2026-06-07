"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  useDeliveryConfiguration,
  useUpdateDeliveryConfiguration,
} from "@/features/delivery-config/hooks/use-delivery-config";
import { DeliveryConfigurationPayload } from "@/features/delivery-config/types";
import { formatDateTime, formatDeliveryEstimate } from "@/lib/utils/format";

export default function SettingsPage() {
  const { isAdmin, user } = useAuth();
  const { data: configuration, isLoading, isError } = useDeliveryConfiguration();
  const updateConfiguration = useUpdateDeliveryConfiguration();
  const [draftValues, setDraftValues] = useState<DeliveryConfigurationPayload | null>(null);
  const formValues = draftValues ?? {
    tempoMinimoMinutos: configuration?.tempoMinimoMinutos ?? 0,
    tempoMaximoMinutos: configuration?.tempoMaximoMinutos ?? 0,
    mensagemLivre: configuration?.mensagemLivre ?? "",
  };

  const estimatedWindow = useMemo(
    () => formatDeliveryEstimate(formValues.tempoMinimoMinutos, formValues.tempoMaximoMinutos),
    [formValues.tempoMaximoMinutos, formValues.tempoMinimoMinutos],
  );
  const isInvalidRange = formValues.tempoMaximoMinutos < formValues.tempoMinimoMinutos;

  async function handleSave() {
    if (!isAdmin || isInvalidRange) {
      return;
    }

    try {
      await updateConfiguration.mutateAsync(formValues);
      setDraftValues(null);
      enqueueSnackbar("Configuração de entrega atualizada.", { variant: "success" });
    } catch {
      enqueueSnackbar("Não foi possível atualizar a configuração de entrega.", { variant: "error" });
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
          <Typography variant="h4">Configurações</Typography>
          <Chip label={`Entrega atual: ${estimatedWindow}`} color="secondary" variant="outlined" />
        </Stack>
        <Typography color="text.secondary">
          Consulte os dados da conta e ajuste os prazos exibidos para os clientes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "grid", gap: 2 }}>
              <Typography variant="h6">Perfil</Typography>
              <Divider />
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Nome
                </Typography>
                <Typography>{user?.nome ?? "Não informado"}</Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  E-mail
                </Typography>
                <Typography>{user?.email ?? "Não informado"}</Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Perfil
                </Typography>
                <Typography>{user?.perfil ?? (isAdmin ? "Administrador" : "Cliente")}</Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ID do usuário
                </Typography>
                <Typography>{user?.id ?? "Não informado"}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ display: "grid", gap: 2.5 }}>
              <Box>
                <Typography variant="h6">Configuração de entrega</Typography>
                <Typography color="text.secondary">
                  Defina o intervalo de tempo que será mostrado como estimativa atual de entrega.
                </Typography>
              </Box>

              {isLoading ? (
                <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
                  <CircularProgress />
                </Box>
              ) : isError ? (
                <Alert severity="error">Não foi possível carregar a configuração de entrega.</Alert>
              ) : (
                <>
                  {!isAdmin ? (
                    <Alert severity="info">
                      Somente administradores podem alterar a configuração de entrega.
                    </Alert>
                  ) : null}

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Tempo mínimo de entrega"
                        value={formValues.tempoMinimoMinutos}
                        onChange={(event) =>
                          setDraftValues((current) => ({
                            ...(current ?? formValues),
                            tempoMinimoMinutos: Number(event.target.value),
                            tempoMaximoMinutos: (current ?? formValues).tempoMaximoMinutos,
                            mensagemLivre: (current ?? formValues).mensagemLivre,
                          }))
                        }
                        slotProps={{ htmlInput: { min: 0 } }}
                        error={isInvalidRange}
                        disabled={!isAdmin || updateConfiguration.isPending}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Tempo máximo de entrega"
                        value={formValues.tempoMaximoMinutos}
                        onChange={(event) =>
                          setDraftValues((current) => ({
                            ...(current ?? formValues),
                            tempoMinimoMinutos: (current ?? formValues).tempoMinimoMinutos,
                            tempoMaximoMinutos: Number(event.target.value),
                            mensagemLivre: (current ?? formValues).mensagemLivre,
                          }))
                        }
                        slotProps={{ htmlInput: { min: 0 } }}
                        error={isInvalidRange}
                        helperText={isInvalidRange ? "O tempo máximo não pode ser menor que o mínimo." : undefined}
                        disabled={!isAdmin || updateConfiguration.isPending}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Mensagem complementar"
                        value={formValues.mensagemLivre}
                        onChange={(event) =>
                          setDraftValues((current) => ({
                            ...(current ?? formValues),
                            tempoMinimoMinutos: (current ?? formValues).tempoMinimoMinutos,
                            tempoMaximoMinutos: (current ?? formValues).tempoMaximoMinutos,
                            mensagemLivre: event.target.value,
                          }))
                        }
                        multiline
                        minRows={3}
                        disabled={!isAdmin || updateConfiguration.isPending}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "20px",
                      bgcolor: "rgba(216,111,157,0.08)",
                      display: "grid",
                      gap: 0.75,
                    }}
                  >
                    <Typography variant="subtitle2">Prévia exibida ao cliente</Typography>
                    <Typography>Entrega estimada: {estimatedWindow}</Typography>
                    {formValues.mensagemLivre ? (
                      <Typography color="text.secondary">{formValues.mensagemLivre}</Typography>
                    ) : null}
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={!isAdmin || updateConfiguration.isPending || isInvalidRange}
                    >
                      Salvar configuração
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (!configuration) {
                          return;
                        }

                        setDraftValues(null);
                      }}
                      disabled={!configuration || updateConfiguration.isPending}
                    >
                      Descartar alterações
                    </Button>
                  </Stack>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Última atualização
                      </Typography>
                      <Typography>{formatDateTime(configuration?.updatedAt)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Atualizado por
                      </Typography>
                      <Typography>{configuration?.updatedByUsuarioId ?? "-"}</Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
