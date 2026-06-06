import { loginSchema } from "@/features/auth/schemas/login-schema";

describe("loginSchema", () => {
  it("accepts a valid payload", () => {
    const result = loginSchema.safeParse({
      email: "cliente@elaine.com",
      senha: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and short password", () => {
    const result = loginSchema.safeParse({
      email: "invalido",
      senha: "123",
    });

    expect(result.success).toBe(false);
  });
});

