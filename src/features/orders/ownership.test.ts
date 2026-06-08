import { describe, expect, it } from "vitest";
import { filterOrdersForViewer } from "@/features/orders/ownership";
import { AuthUser } from "@/lib/auth/session";

const viewer: AuthUser = {
  id: "7",
  email: "cliente@elaine.com",
};

describe("filterOrdersForViewer", () => {
  it("keeps only orders linked to the authenticated user", () => {
    const orders = [
      {
        id: 1,
        status: "CRIADO",
        tipoEntrega: "ENTREGA",
        desconto: 0,
        itens: [],
        usuarioId: 7,
      },
      {
        id: 2,
        status: "CRIADO",
        tipoEntrega: "ENTREGA",
        desconto: 0,
        itens: [],
        usuarioEmail: "cliente@elaine.com",
      },
      {
        id: 3,
        status: "CRIADO",
        tipoEntrega: "ENTREGA",
        desconto: 0,
        itens: [],
        usuarioId: 99,
      },
      {
        id: 4,
        status: "CRIADO",
        tipoEntrega: "ENTREGA",
        desconto: 0,
        itens: [],
      },
    ];

    expect(filterOrdersForViewer(orders, viewer, false).map((order) => order.id)).toEqual([1, 2]);
  });

  it("returns every order for admins", () => {
    const orders = [
      {
        id: 1,
        status: "CRIADO",
        tipoEntrega: "ENTREGA",
        desconto: 0,
        itens: [],
      },
    ];

    expect(filterOrdersForViewer(orders, viewer, true)).toEqual(orders);
  });
});
