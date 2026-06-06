import { formatCurrency } from "@/lib/utils/format";

describe("formatCurrency", () => {
  it("formats values in BRL", () => {
    expect(formatCurrency(55)).toBe("R$ 55,00");
  });
});

