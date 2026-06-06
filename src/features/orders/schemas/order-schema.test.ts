import { orderSchema } from "@/features/orders/schemas/order-schema";

describe("orderSchema", () => {
  it("accepts a valid order payload", () => {
    const result = orderSchema.safeParse({
      nomeRecebedor: "Elaine",
      endereco: "Rua das Flores, 123",
      tipoEntrega: "ENTREGA",
      horarioEntrega: "18:30",
      desconto: 5,
      status: "EM_ABERTO",
      itens: [{ produtoId: 1, quantidade: 2 }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects order without items", () => {
    const result = orderSchema.safeParse({
      nomeRecebedor: "Elaine",
      endereco: "Rua das Flores, 123",
      tipoEntrega: "ENTREGA",
      horarioEntrega: "18:30",
      desconto: 5,
      itens: [],
    });

    expect(result.success).toBe(false);
  });

  it("requires delivery details for entrega", () => {
    const result = orderSchema.safeParse({
      tipoEntrega: "ENTREGA",
      desconto: 0,
      itens: [{ produtoId: 1, quantidade: 1 }],
    });

    expect(result.success).toBe(false);
  });

  it("requires pickup schedule for retirada", () => {
    const result = orderSchema.safeParse({
      tipoEntrega: "RETIRADA",
      desconto: 0,
      itens: [{ produtoId: 1, quantidade: 1 }],
    });

    expect(result.success).toBe(false);
  });
});
