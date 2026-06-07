import { httpClient } from "@/lib/http/http-client";
import { LoginFormValues } from "@/features/auth/schemas/login-schema";
import { SignupFormValues } from "@/features/auth/schemas/signup-schema";
import { AuthUser } from "@/lib/auth/session";

type LoginResponse = {
  token: string;
  isAdmin?: boolean;
  user?: AuthUser & {
    isAdmin?: boolean;
  };
  usuario?: AuthUser & {
    isAdmin?: boolean;
    endereco?: string;
    telefone?: string;
    cpf?: string;
    cnpj?: string | null;
    dataNascimento?: string;
  };
};

export const authService = {
  async login(payload: LoginFormValues) {
    const { data } = await httpClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: SignupFormValues) {
    const { data } = await httpClient.post("/usuarios", payload);
    return data;
  },
};
