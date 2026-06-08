import { describe, expect, it } from "vitest";
import { countActiveOrders } from "@/features/orders/metrics";

describe("countActiveOrders", () => {
  it("counts only orders that are not closed", () => {
    expect(
      countActiveOrders([
        { id: 1, status: "EM_ABERTO", tipoEntrega: "ENTREGA", desconto: 0, itens: [] },
        { id: 2, status: "EM_PREPARO", tipoEntrega: "ENTREGA", desconto: 0, itens: [] },
        { id: 3, status: "FINALIZADO", tipoEntrega: "ENTREGA", desconto: 0, itens: [] },
        { id: 4, status: "CANCELADO", tipoEntrega: "ENTREGA", desconto: 0, itens: [] },
        { id: 5, status: "ENTREGUE", tipoEntrega: "ENTREGA", desconto: 0, itens: [] },
      ]),
    ).toBe(2);
  });
});
