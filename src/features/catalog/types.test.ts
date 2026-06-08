import { mapApiProduct } from "@/features/catalog/types";

describe("mapApiProduct", () => {
  it("prioritizes imagemUrl over anexo when both are present", () => {
    const product = mapApiProduct(
      {
        produtoId: 1,
        nome: "Bolo de Morango",
        imagemUrl: "https://cdn.example.com/bolo.jpg",
        anexo: {
          base64: "YWJjMTIz",
          nomeArquivo: "bolo.png",
        },
      },
      0,
    );

    expect(product?.imagemUrl).toBe("https://cdn.example.com/bolo.jpg");
  });

  it("falls back to anexo when imagemUrl is not provided", () => {
    const product = mapApiProduct(
      {
        produtoId: 2,
        nome: "Brigadeiro",
        anexo: {
          base64: "YWJjMTIz",
          nomeArquivo: "brigadeiro.png",
        },
      },
      0,
    );

    expect(product?.imagemUrl).toBe("data:image/png;base64,YWJjMTIz");
  });
});
