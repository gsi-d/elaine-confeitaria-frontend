export type CartItem = {
  id: string;
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

export type CheckoutDraft = {
  tipoEntrega: "ENTREGA" | "RETIRADA";
  nomeRecebedor: string;
  endereco: string;
  complemento: string;
  referencia: string;
  horarioEntrega: string;
  horarioRetirada: string;
  observacoes: string;
};
