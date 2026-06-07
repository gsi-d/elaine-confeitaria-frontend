export type DeliveryConfiguration = {
  tempoMinimoMinutos: number;
  tempoMaximoMinutos: number;
  mensagemLivre: string;
  updatedAt?: string;
  updatedByUsuarioId?: number;
};

export type DeliveryConfigurationPayload = {
  tempoMinimoMinutos: number;
  tempoMaximoMinutos: number;
  mensagemLivre: string;
};
