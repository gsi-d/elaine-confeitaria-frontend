export type OrderItemPayload = {
  produtoId: number;
  quantidade: number;
};

export type OrderPayload = {
  nomeRecebedor?: string;
  endereco?: string;
  complemento?: string;
  referencia?: string;
  tipoEntrega: "ENTREGA" | "RETIRADA";
  horarioEntrega?: string;
  horarioRetirada?: string;
  observacoes?: string;
  desconto: number;
  status?: string;
  itens: OrderItemPayload[];
};

export type Order = {
  id: number;
  nomeRecebedor?: string;
  endereco?: string;
  complemento?: string;
  referencia?: string;
  tipoEntrega: "ENTREGA" | "RETIRADA";
  horarioEntrega?: string;
  horarioRetirada?: string;
  observacoes?: string;
  desconto: number;
  status: string;
  itens: OrderItemPayload[];
};
